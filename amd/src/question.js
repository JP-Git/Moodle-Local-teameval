/*

This is the interface for your question plugins' AMD module. Your plugin MUST implement a module that returns
a function whose prototype conforms to the Question interface. You MAY define other functions on your class
for use within your plugin.

*/

/**
 * Your constructor must conform to this signature, even if you do not use some of these parameters.
 *
 * @param container {jQuery} The top level of your question. Insert your content in this container.
 * @param teameval {int} The ID of the team evaluation instance. Useful to pass to web services.
 * @param self {bool} If self-evaluation is enabled.
 * @param editable {bool} If this user can edit this team evaluation. (Do not use as a replacement for guard_capability!)
 * @param questionID {int|null} The question ID for this question
 * @param context {Object|null} Context data provided by your question subclass
 */

define(['jquery', 'core/fragment', 'core/notification', 'core/templates', 'core/ajax'],
    function($, Fragment, Notification, Templates, Ajax) {

 /*eslint no-unused-vars:0*/
function Question(container, teameval, contextid, self, editable, optional, questionID, context) {
    this.teameval = teameval;
    this.questionID = questionID;
    this.container = container;
    this.contextid = contextid;
    this.optional = optional;
}

/**
 * Replace the contents of container with the submitter's view.
 * @return {Promise} A promise that resolves when the view has changed.
 */
Question.prototype.submissionView = function() {
    // Default implementation: either return a value from submissionTemplate or define your pluginName
    var submissionTemplate = this.submissionTemplate();
    if (submissionTemplate) {
        var submissionContext = this.submissionContext();
        var promise = Templates.render(submissionTemplate, submissionContext);
        return promise.done(function(html, js) {
            Templates.replaceNodeContents(this.container, html, js);
        }.bind(this));
    }
};

/**
 * Replace the contents of container with the editing view.
 * @return {Promise} A promise that resolves when the view has changed.
 */
Question.prototype.editingView = function() {
    var editingTemplate = this.editingTemplate();
    if (editingTemplate) {
        var editingContext = this.editingContext();
        var promise = Templates.render(editingTemplate, editingContext);
        promise.done(function(html, js) {
            Templates.replaceNodeContents(this.container, html, js);
        }.bind(this));
        return promise;
    }
};

/**
 * Save question data back to the database in Moodle. You must use should_update_question/update_question.
 * @param ordinal {int} The index of this question in the questionnaire. You must pass this to update_question().
 * @return {Promise} A promise that resolves with the question ID when the save is complete.
 */
Question.prototype.save = function(ordinal) {};

/**
 * Delete the question in Moodle. You must use should_delete_question/delete_question.
 * @return {Promise} A promise that resolves when the question has been deleted.
 */
Question.prototype.delete = function() {
    if (this.questionID && this.pluginName) {
        var promises = Ajax.call([{
            methodname: 'teamevalquestion_'+this.pluginName+'_delete_question',
            args: {
                teamevalid: this.teameval,
                id: this.questionID
            }
        }]);

        return promises[0];
    }
    // No ID, never been saved
    return $.Deferred().resolve();
};

/**
 * Submit this response to Moodle. You should check if the user can submit using can_submit_response.
 * You MUST call the function that is passed to you as the first argument to submit(). You should call
 * this with either the arguments to an Ajax.call method (an object with "methodname" and "args"), or
 * you can call it with no arguments to indicate that no AJAX call is needed. The callback will return
 * the Promise that corresponds to your AJAX call.
 *
 * You SHOULD return a boolean true or false stating whether or not the question has been sufficiently
 * filled out to constitute being complete. If this does not make sense for your question type, you MUST
 * return true.
 *
 * Basically, your function should look like this:
 *
 *     var promise = callback({ methodname: "my_plugin_submit_question",
 *         args: { teamevalid: this.teameval, id: this.questionID, response: myUsersResponseData }});
 *     promise.done(function(data) {
 *         // this bit is totally optional
 *         updateDisplay(data);
 *     });
 *
 * If submission involves multiple webservice calls, you should return the one that finalises the response.
 * In other words, given a fully completed questionnaire, Team Evaluation should be able to use your
 * response to calculate scores. If you need to make calls to update your state that don't affect the
 * response, you may do so afterward, using promise.done.
 *
 * @return {bool} true if the question is complete, otherwise false
 */
Question.prototype.submit = function(callback) {};

/**
 * This function is called when the user hits "Reset". The default implementation calls resetSubmissionContext
 * and then simply re-renders the submission view.
 *
 * @return {Promise} Resolve when you're finished resetting the submission view.
 */
Question.prototype.reset = function() {
    this.resetSubmissionContext();
    return this.submissionView();
};

// The following are convenience methods or helpers for default implementations


// Override any of these four methods to use the built-in templating system
Question.prototype.submissionTemplate = function() {
    if (this.pluginName) {
        return 'teamevalquestion_'+this.pluginName+'/submission_view';
    }
    return null;
};

Question.prototype.submissionContext = function() {
    return {};
};

Question.prototype.editingTemplate = function() {
    if (this.pluginName) {
        return 'teamevalquestion_'+this.pluginName+'/editing_view';
    }
    return null;
};

Question.prototype.editingContext = function() {
    return {};
};

// Override this to use the default implementation of reset()
Question.prototype.resetSubmissionContext = function() {};


/**
 * Convenience function to get an Ajaxform and replace the container contents with it
 * @param  {string} The fully-qualified class name of the form
 * @param  {string} The form data to feed to set_data
 * @param  {customdata} The custom data to give as a the second parameter in the form's constructor
 * @return {promise} A promise that will resolve when the fragment is loaded
 */
Question.prototype.editForm = function(form, formdata, customdata) {
    var params = {
        'form': form,
        'jsonformdata': JSON.stringify(formdata),
        'customdata': JSON.stringify(customdata)
    };

    var promise = Fragment.loadFragment('local_teameval', 'ajaxform', this.contextid, params);

    promise.done(function(html, js) {
        Templates.replaceNodeContents(this.container, html, js);
    }.bind(this));

    promise.fail(Notification.exception);

    return promise;
};

Question.prototype.submitForm = function(form, method, args) {
    var promise = this.validateData(form).then(function() {

        args.formdata = $(form).serialize();

        var promises = Ajax.call([{
            methodname: method,
            args: args
        }]);

        return promises[0];

    }.bind(this));

    promise.fail(function(error) {

        if (error && error.errorcode) {
            Notification.exception(error);
        }

    }.bind(this));

    return promise;
};

Question.prototype.saveForm = function(form, ordinal, options, callback) {
    var defaults = {
        ordinalName: 'ordinal',
        questionIDName: 'id',
        methodname: 'teamevalquestion_'+this.pluginName+'_update_question',
        args: {'teamevalid': this.teameval},
        resolveWithID: true
    };

    var parsed_options = $.extend({}, defaults, options);

    $(form).find('[name='+parsed_options.ordinalName+']').val(ordinal);

    if (this.questionID) {
        $(form).find('[name='+parsed_options.questionIDName+']').val(this.questionID);
    }

    return this.submitForm(form, parsed_options.methodname, parsed_options.args).then(function(result) {
        this.questionID = result.id;
        if (callback) {
            callback(result);
        }
        return parsed_options.resolveWithID ? result.id : result;
    }.bind(this));
};

Question.prototype.validateData = function(form) {

    return $.Deferred().resolve().promise();
};

return Question;

});
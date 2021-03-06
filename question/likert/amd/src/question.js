define(['jquery',
        'local_teameval/question',
        'core/templates',
        'core/ajax',
        'core/str',
        'local_teameval/editor',
        'local_teameval/formparse'],
    function($, Question, Templates, Ajax, Strings, Editor, FormParse) {

    function LikertQuestion(container, teameval, contextid, self, editable, optional, questionID, context) {
        Question.apply(this, arguments);

        this._self = self;
        this._editable = editable;

        context = context || {};
        this._submissioncontext = context.submissioncontext || {};
        this._editingcontext = context.editingcontext || {};
        this._editinglocked = context.editinglocked || false;

        this._editingcontext.teameval = this.teameval;

        this._meanings = {};

        this.pluginName = 'likert';
    }

    LikertQuestion.prototype = new Question();

    LikertQuestion.prototype.submissionContext = function() { return this._submissioncontext; };

    LikertQuestion.prototype.editingView = function() {
        return this.editForm('\\teamevalquestion_likert\\forms\\settings_form',
                             $.param(this._editingcontext),
                             {'locked': this._editinglocked})
        .done(function() {
            this.container.find('[name="range[min]"], [name="range[max]"]').change(this.updateMeanings.bind(this));
        }.bind(this));
    };

    LikertQuestion.prototype.save = function(ordinal) {
        this.updateMeanings();

        var form = this.container.find('form');
        Editor.saveAll(form);

        var data = FormParse.serializeObject(form);

        return this.saveForm(form, ordinal, {}, function(result) {
            this._submissioncontext = JSON.parse(result.submissionContext);
            this._editingcontext = data;
            this._editingcontext.id = result.id;
        }.bind(this));

    };

    LikertQuestion.prototype.submit = function(call) {
        var marks = [];
        this.container.find('.responses tbody input[type="radio"]:checked').each(function() {
            var toUser = $(this).data('touser');
            var m = {};
            m.touser = toUser;
            m.value = this.value;
            marks.push(m);
        });

        call({
            methodname: 'teamevalquestion_likert_submit_response',
            args: {
                teamevalid: this.teameval,
                id: this.questionID,
                marks: marks
            }
        });

        var incomplete = this.checkComplete();

        return !incomplete;
    };

    LikertQuestion.prototype.updateMeanings = function() {
        var minval = parseInt(this.container.find('[name="range[min]"]').val());
        var maxval = parseInt(this.container.find('[name="range[max]"]').val());

        for (var i = 0; i <= 10; i++) {
            var meaning = this.container.find('[name="meanings['+i+']"]');
            this._meanings[i] = meaning.val();

            if (!this._editinglocked) {
                if ((i >= minval) && (i <= maxval)) {
                    meaning.closest('.fitem').addBack().removeClass('hidden');
                } else {
                    meaning.closest('.fitem').addBack().addClass('hidden');
                }
            }
        }
    };

    LikertQuestion.prototype.validateData = function(form) {

        var deferred = $.Deferred();

        var data = FormParse.serializeObject(form);

        if ((data.title.trim().length === 0) && (data.description.text.trim().length === 0)) {
            Strings.get_string('titleordescription', 'teamevalquestion_likert').done(function(str) {
                this.container.find('[name=title]')
                    .closest('.control-group').addClass('error').end()
                    .next('.help-inline').text(str);

                deferred.reject();
            }.bind(this));
        } else {
            deferred.resolve();
        }

        return deferred.promise();
    };

    LikertQuestion.prototype.checkComplete = function() {

        var userids = this._submissioncontext.users.map(function(v) { return parseInt(v.userid); });

        var markedUsers = this.container.find('input:radio:checked').map(function() { return $(this).data('touser'); }).get();

        var missingUsers = userids.filter(function(v) { return markedUsers.indexOf(v) === -1; });

        if (missingUsers.length > 0) {
            this.container.parent().addClass('incomplete');
        } else {
            this.container.parent().removeClass('incomplete');
        }

        return (missingUsers.length > 0);
    };

    LikertQuestion.prototype.reset = function() {
        this.container.find(".responses tbody input[type='radio']:checked").prop('checked', false);
        return $.Deferred().resolve().promise();
    };

    return LikertQuestion;

});
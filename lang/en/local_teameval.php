<?php

    $string['pluginname'] = 'Team evaluation';
    $string['teameval'] = 'Team evaluation plugin';

    $string['subplugintype_teamevalquestion'] = 'Question';
    $string['subplugintype_teamevalquestion_plural'] = 'Questions';
    $string['subplugintype_teamevaluator'] = 'Evaluator';
    $string['subplugintype_teamevaluator_plural'] = 'Evaluators';
    $string['subplugintype_teamevalreport'] = 'Report';
    $string['subplugintype_teamevalreport_plural'] = 'Reports';

    $string['teameval:changesettings'] = 'Change team evaluation settings';
    $string['teameval:createquestionnaire'] = 'Create and edit team evaluation questionnaires';
    $string['teameval:invalidateassessment'] = 'Invalidate team evaluation assessments';
    $string['teameval:publishquestionnaire'] = 'Make team evaluation questionnaires available to other users.';
    $string['teameval:viewtemplate'] = 'Copy questions from this questionnaire into another questionnaire';
    $string['teameval:submitquestionnaire'] = 'Submit responses to a team evaluation questionnaire';
    $string['teameval:viewallteams'] = 'View responses from all teams in a team evaluation';
    $string['teameval:viewownteam'] = 'View responses from user\'s own team in a team evaluation';
    $string['teameval:viewsubmitternames'] = 'View names of respondants in a team evaluation';

    $string['cachedef_settings'] = 'Team evaluation settings data.';
    $string['cachedef_evalcontext'] = 'Team evaluation context data; used to mediate between team evaluation and host activity plugin.';

    $string['turnonteameval'] = 'Turn On Team Evaluation';
    $string['enablingteameval'] = 'Enabling Team Evaluation...';
    $string['teamevaldisabled'] = 'The current settings in this activity prohibit team evaluation.';

    $string['questionnaire'] = 'Questionnaire';
    $string['results'] = 'Results';
    $string['releasemarks'] = 'Release Marks';
    $string['feedback'] = 'Feedback';

    $string['settings'] = 'Settings';
    $string['enabled'] = 'Enabled';
    $string['selfassessment'] = 'Self-assessment';
    $string['selfassessment_help'] = 'Allow students to evaluate their own performance';
    $string['autorelease'] = 'Automatically Release Marks';
    $string['autorelease_help'] = 'Release marks as soon as they are ready. Otherwise marks must be manually released to students.';
    $string['public'] = 'Public';
    $string['public_help'] = 'Other users who can see this questionnaire can duplicate it in their courses';
    $string['fraction'] = 'Adjustment Fraction';
    $string['deadline'] = 'Deadline';
    $string['noncompletionpenalty'] = 'Non-completion penalty';
    $string['save'] = 'Save'; //HOW IS THIS NOT IN CORE

    $string['reporttype'] = 'Report type';

    $string['addquestion'] = 'Add Question';
    $string['saving'] = 'Saving...';
    $string['saved'] = 'Saved!';

    $string['questionnairelocked'] = 'This questionnaire cannot be edited because <strong>{$a}</strong>.';
    $string['lockedreasonvisible'] = 'one or more submitters can already see it';
    $string['lockedreasonmarked'] = 'one or more submitters has already submitted marks';

    $string['lockedhintvisible'] = 'You can solve this by hiding the activity, or otherwise making it unavailable.';
    $string['lockedhintmarked'] = 'To prevent marks from being lost, this questionnaire is now permanently locked.';

    $string['releaseallmarks'] = 'Release All Marks';
    $string['score'] = 'Score';

    $string['releaseallmarkstext'] = 'Releasing marks will also release text in the <I>Comment</I> question type unless rejected.';
    $string['releaseallmarksinfo'] = 'Release';
    $string['releaseallmarksinfo_help'] = <<<HTML
If you have included the <I>Comment</I> question type, student responses should be reviewed prior to releasing marks. Comments are treated as feedback and will be pushed to the Gradebook once released. To review and reject or release comments on a group or student basis, click on <I>Results</I>, and then from the <I>Report type</I> dropdown list, choose <I>Feedback</I>.
HTML;

    $string['yourself'] = 'Yourself';
    $string['self'] = 'Self';
    $string['themself'] = 'Themself';
    $string['themselves'] = 'Themselves';

    $string['exampleuser'] = 'Example User';

    $string['youradjustedscore'] = 'Your adjusted score';
    $string['yourteammatesfeedback'] = 'Your teammates\' feedback';

    $string['incompleteadvice'] = 'This question is incomplete.';
    $string['incompletewarning'] = 'There are {$a} incomplete questions.';
    $string['incompletewarning1'] = 'There is 1 incomplete question.';
    $string['incompletesummary'] = 'You have {$a->n} incomplete questions, resulting in a {$a->penalty}% non-completion penalty.';
    $string['incompleteoverview'] = 'Not completed yet';

    $string['resetresponses'] = 'Delete all team evaluation responses';
    $string['resetquestionnaire'] = 'Delete all questions from team evaluation questionnaire';

    $string['templatesheading'] = 'Templates toolbox';

    $string['addquestionsfrom'] = 'Add questions from template:';
    $string['downloadtemplate'] = 'Download questionnaire as template file';
    $string['uploadtemplate'] = 'Add questions from template file';

    $string['fromtemplate'] = 'From <strong>{$a}</strong>';
    $string['matchingtags'] = 'Matching tags: {$a}';
    $string['templatepreview'] = 'Adding {$a->numqs} questions from {$a->from}';

    // ERRORS

    $string['contextnotchild'] = '{$a->child} is not a child of {$a->parent}.';
    $string['questionidsoutofsync'] = 'Tried to set order of questions, but not all questions were included. Try reloading the page.';
    $string['tooearly'] = 'The task tried to run before the deadline.';
    $string['notinowngroup'] = 'User with ID {$a} is not in the group Team Evaluation thinks they\'re in. Check your group memberships and permission settings.';

    $string['extragroups'] = 'Some users are in a group that the activity doesn\'t know about; this is probably a bug. The extra groups are: {$a}';
    $string['missinggroups'] = 'There are some extra groups with no members. Do you have groups with non-submitting users in them? The extra groups are: {$a}';
    $string['nosingleusergroups'] = 'Some groups have fewer than two members; this is not supported by Team Evaluation. The problematic groups are: {$a}';
    $string['extramembers'] = 'Group membership check failed. Are there some users in multiple groups, or non-submitting users in groups? The problem is with these members of {$a->group}: {$a->extras}';
    $string['missingmembers'] = 'Group membership check failed. Are there some users in multiple groups, or non-submitting users in groups? The problem is with these members of {$a->group}: {$a->missing}';
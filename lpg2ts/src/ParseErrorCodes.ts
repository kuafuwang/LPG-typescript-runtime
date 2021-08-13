
export enum ParseErrorCodes {
     LEX_ERROR_CODE = 0,
     ERROR_CODE = 1,
     BEFORE_CODE = 2,
     INSERTION_CODE = 3,
     INVALID_CODE = 4,
     SUBSTITUTION_CODE = 5,
     SECONDARY_CODE = 5,
     DELETION_CODE = 6,
     MERGE_CODE = 7,
     MISPLACED_CODE = 8,
     SCOPE_CODE = 9,
     EOF_CODE = 10,
     INVALID_TOKEN_CODE = 11,
     ERROR_RULE_ERROR_CODE = 11,
     ERROR_RULE_WARNING_CODE = 12,
     NO_MESSAGE_CODE = 13,

     MANUAL_CODE = 14
}

export let errorMsgText: readonly string[] =
[
    /* LEX_ERROR_CODE */                       "unexpected character ignored", //$NON-NLS-1$
    /* ERROR_CODE */                           "parsing terminated at this token", //$NON-NLS-1$
    /* BEFORE_CODE */                          " inserted before this token", //$NON-NLS-1$
    /* INSERTION_CODE */                       " expected after this token", //$NON-NLS-1$
    /* INVALID_CODE */                         "unexpected input discarded", //$NON-NLS-1$
    /* SUBSTITUTION_CODE, SECONDARY_CODE */    " expected instead of this input", //$NON-NLS-1$
    /* DELETION_CODE */                        " unexpected token(s) ignored", //$NON-NLS-1$
    /* MERGE_CODE */                           " formed from merged tokens", //$NON-NLS-1$
    /* MISPLACED_CODE */                       "misplaced construct(s)", //$NON-NLS-1$
    /* SCOPE_CODE */                           " inserted to complete scope", //$NON-NLS-1$
    /* EOF_CODE */                             " reached after this token", //$NON-NLS-1$
    /* INVALID_TOKEN_CODE, ERROR_RULE_ERROR */ " is invalid", //$NON-NLS-1$
    /* ERROR_RULE_WARNING */                   " is ignored", //$NON-NLS-1$
    /* NO_MESSAGE_CODE */                      "" //$NON-NLS-1$
];
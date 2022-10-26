export module RiskyColors {

export const enum subtreeColorList {
/*ALTERNATING COLORS TO ASSIGN TO SUBTREE NODES AND SUBREE CONTROLS*/
    /*Oranges*/   
    o1 = 'rgb(255, 111, 89)',
    o2 = 'rgb(244, 96, 54)',
    o3 = 'rgb(255, 127, 17)',
    o4 = 'rgb(193, 120, 23)',
    o5 = 'rgb(191, 78, 48)',

    /*Greens*/
    g1 = 'rgb(85, 145, 127)',
    g2 = 'rgb(107, 171, 144)',
    g3 = 'rgb(77, 170, 87)',
    g4 = 'rgb(73, 145, 103)',

    /*Browns*/   
    b1 = 'rgb(134, 131, 109)',
    b2 = 'rgb(108, 83, 78)',
    b3 = 'rgb(176, 113, 86)',
    b4 = 'rgb(64, 46, 42)',
    b5 = 'rgb(109, 76, 61)',

    /*Green-Blues*/   
    gb1 = 'rgb(118, 152, 179)',
    gb2 = 'rgb(77, 161, 169)',
    gb3 = 'rgb(4, 104, 101)',
    gb4 = 'rgb(54, 65, 62)',
    gb5 = 'rgb(42, 157, 143)',

    /*Purple*/   
    p1 = 'rgb(89, 63, 98)',
    p2 = 'rgb(127, 85, 125)',
    p3 = 'rgb(94, 35, 157)',
    p4 = 'rgb(57, 47, 90)',
    p5 = 'rgb(74, 13, 103)',

    /*Purple-Red*/   
    pr1 = 'rgb(103, 60, 79)',
    pr2 = 'rgb(86, 32, 61)',
    pr3 = 'rgb(93, 46, 70)',
    pr4 = 'rgb(104, 69, 81)',
    pr5 = 'rgb(126, 78, 96)',

    /*Darks*/   
    d1 = 'rgb(45, 30, 47)',
    d2 = 'rgb(64, 63, 76)',
    d3 = 'rgb(22, 0, 30)',
    d4 = 'rgb(4, 42, 43)',

    /*Blues*/   
    bl1 = 'rgb(46, 80, 119)',
    bl2 = 'rgb(63, 136, 197)',
    bl3 = 'rgb(61, 84, 103)',
    bl4 = 'rgb(0, 50, 73)',
    bl5 = 'rgb(0, 31, 84)',

    /*Reds*/   
    r1 = 'rgb(163, 11, 55)',
    r2 = 'rgb(90, 0, 1)',
    r3 = 'rgb(221, 4, 38)',
    r4 = 'rgb(178, 13, 48)',
    r5 = 'rgb(124, 11, 43)',

    /*Pinks*/   
    pp1 = 'rgb(234, 82, 111)',
    pp2 = 'rgb(248, 117, 117)',
    pp3 = 'rgb(214, 69, 80)',
    pp4 = 'rgb(239, 118, 122)',
    pp5 = 'rgb(219, 39, 99)',
}

export const enum uiColors {
    /*====PRIMARY COLORS====*/
    /*Primary color used for important buttons on a page, selected states, or special action indicators. Should be used sparingly*/
    primaryCTA = 'rgb(17, 91, 251)',
    /*14% darker than primary CTA*/
    primaryCTAhover = 'rgb(3, 70, 216)',
       /*14% darker than primary CTA*/
    primaryCTAdisabled = 'rgb(35, 35, 35)',
    /*====BACKGROUNDS====*/
    /*Pane background is for most containers*/
    paneBackground = 'rgb(42, 42, 42)',
    /*Header background is for secondary level containers. Primarly intended for the top header bar*/
    headerBackground = 'rgb(48, 48, 48)',
    /*Main background is for the furthestmost background on the application for the body of the app*/
    mainBackground = 'rgb(25, 25, 25)',
    /*Main node background is the default node background color*/
    mainNodeBackground = 'rgb(72, 72, 72)',

    /*====INTERACTIVE COMPONENTS====*/
    /*Field input is for any component where the user inputs/selects data*/
    fieldInput = 'rgb(72, 72, 72)',
    /*Button primary is for form field main buttons*/
    buttonPrimary = 'rgb(46, 55, 73)',
    /*Button secondary is for non-primary buttons, such as open/close buttons and drop down select buttons*/
    buttonSecondary = 'rgb(72, 72, 72)',
    /*Button secondary pressed is for when a secondary button is pressed, color should swap out to indicate selection*/
    buttonSecondaryPressed = 'rgb(72, 72, 72, .4)',

    /*====TEXT COLORS====*/
    /*Main text is for most text in the application. Especially while resting on a field input, pane, or a button*/
    mainText = 'rgb(238, 238, 238)',
    /*Secondary text is for non-important text, like text resting on the main background*/
    secondaryText = 'rgb(238, 238, 238, .75)',
    /*Disabled text is for when text is disabled. Opacity will decrease*/
    disabledText = 'rgb(238, 238, 238, .4)',

    /*====STANDARD NODE INDICATORS====*/
    /*Min max is used for min/max indicators*/
    minMax = 'rgb(33, 39, 56)',
    /*Condition is used for condition indicators*/
    condition = 'rgb(3, 71, 50)',

    /*====OTHER COLORS====*/
    /*Main highlight border is for when a modal, field or node is actively selected*/
    mainHighlightBorder = 'rgb(238, 238, 238)',
    /*Nodeline is the default color of the lines connecting nodes*/
    nodeLine = 'rgb(219, 219, 219)',
    /*Positive is the color used for 'good' or 'desirable' states, such as positive trend node lines, or positive reinforcement messages*/
    positive = 'rgb(58, 208, 163)',
    /*Negative is the color used for 'bad' or 'warning' states, such as negative trend lines, or negative reinforcement messages*/
    negative = 'rgb(251, 35, 67)',


}
}

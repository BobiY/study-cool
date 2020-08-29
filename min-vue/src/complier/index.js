
/*
var handler ={
	startElement:   function (sTagName, oAttrs) {},
	endElement:     function (sTagName) {},
    characters:		function (s) {},
    comment:		function (s) {}
};
*/

const startTagRe = /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m
const endTagRe = /^<\/([^>\s]+)[^>]*>/m
const attrRe = /([^=\s]+)(\s*=\s*((\"([^"]*)\")|(\'([^']*)\')|[^>\s]+))?/gm
export default class Parser {
  constructor() {
    this.handler = null
    this.startTagRe = startTagRe
    this.endTagRe = endTagRe
    this.attrRe = attrRe
  }

  parse (string, oHandler) {
    // 除去传递的字符串的格式数据
    let s = string.replace(/\r?\n/g,"")
    if (oHandler)
      this.contentHandler = oHandler;

    var i = 0;
    var res, lc, lm, rc, index;
    var treatAsChars = false;
    var oThis = this;
    while (s.length > 0) {
      // Comment
      if (s.substring(0, 4) == "<!--") {
        index = s.indexOf("-->");
        if (index != -1) {
          this.contentHandler.comment(s.substring(4, index));
          s = s.substring(index + 3);
          treatAsChars = false;
        }
        else {
          treatAsChars = true;
        }
      }

      // end tag
      else if (s.substring(0, 2) == "</") {
        if (this.endTagRe.test(s)) {
          lc = RegExp.leftContext;
          lm = RegExp.lastMatch;
          rc = RegExp.rightContext;

          lm.replace(this.endTagRe, function () {
            return oThis.parseEndTag.apply(oThis, arguments);
          });

          s = rc;
          treatAsChars = false;
        }
        else {
          treatAsChars = true;
        }
      }
      // start tag
      else if (s.charAt(0) == "<") {
        if (this.startTagRe.test(s)) {
          lc = RegExp.leftContext;
          lm = RegExp.lastMatch;
          rc = RegExp.rightContext;

          lm.replace(this.startTagRe, function () {
            return oThis.parseStartTag.apply(oThis, arguments);
          });

          s = rc;
          treatAsChars = false;
        }
        else {
          treatAsChars = true;
        }
      }

      if (treatAsChars) {
        index = s.indexOf("<");
        if (index == -1) {
          this.contentHandler.characters(s);
          s = "";
        }
        else {
          this.contentHandler.characters(s.substring(0, index));
          s = s.substring(index);
        }
      }

      treatAsChars = true;
    }
  }
  parseStartTag (sTag, sTagName, sRest) {
    var attrs = this.parseAttributes(sTagName, sRest);
    this.contentHandler.startElement(sTagName, attrs);
  }

  parseEndTag (sTag, sTagName) {
    this.contentHandler.endElement(sTagName);
  }

  parseAttributes (sTagName, s) {
    var oThis = this;
    var attrs = [];
    s.replace(this.attrRe, function (a0, a1, a2, a3, a4, a5, a6) {
      attrs.push(oThis.parseAttribute(sTagName, a0, a1, a2, a3, a4, a5, a6));
    });
    return attrs;
  }

  parseAttribute (sTagName, sAttribute, sName) {
    var value = "";
    if (arguments[7])
      value = arguments[8];
    else if (arguments[5])
      value = arguments[6];
    else if (arguments[3])
      value = arguments[4];

    var empty = !value && !arguments[3];
    return { name: sName, value: empty ? null : value };
  }
}

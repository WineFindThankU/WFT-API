export const toUniCode = (text) => {
  let unicode = ''
  for (var i = 0, l = text.length; i < l; i++) {
    unicode += '\\' + text[i].charCodeAt(0).toString(16)
  }
  return unicode
}

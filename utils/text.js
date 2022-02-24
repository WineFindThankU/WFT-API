import Hangul from 'hangul-js'

export const toUniCode = (text) => {
  let unicode = ''
  Hangul.disassemble(text).map((char) => {
    unicode += '\\' + char.charCodeAt(0).toString(16)
  })
  return unicode
}

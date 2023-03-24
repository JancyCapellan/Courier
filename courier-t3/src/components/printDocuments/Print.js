import { renderToStaticMarkup } from 'react-dom/server'

/**
 * Print an HTMLElement
 *
 * @param el HTMLElement
 * @param styles Optional styles (css texts or urls) that will add to iframe document.head
 * @param scripts Optional scripts (script texts or urls) that will add to iframe document.body
 * @param callback Optional callback that will be triggered when content is ready to print
 */
export function printJsx(DocumentComponent) {
  let output = document.implementation.createHTMLDocument('New Document')
  let receipt = output.createElement('section')
  const staticElement = renderToStaticMarkup(DocumentComponent)
  receipt.innerHTML = staticElement
}

export function printDiv(divName) {
  var printContents = document.getElementById(divName).innerHTML
  var originalContents = document.body.innerHTML

  document.body.innerHTML = printContents

  window.print()

  document.body.innerHTML = originalContents
}

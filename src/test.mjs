const response = fetch('https://docs.firecrawl.dev/introduction')
const html = response.then(response => response.text())
import TurndownService from 'turndown';
import turndownPluginGfm from 'turndown-plugin-gfm'

var gfm = turndownPluginGfm.gfm

html.then(html => {

    // For Node.js

    var turndownService = new TurndownService();
    turndownService.use(gfm)
    turndownService.remove('script');
    turndownService.remove('style');

    /**
    * Repeat string
    */
    function repeat(character, count) {
        return Array(count + 1).join(character);
    }

    function convertToFencedCodeBlock(node, options) {
        node.innerHTML = node.innerHTML.replaceAll('<br-keep></br-keep>', '<br>');
        const langMatch = node.id?.match(/code-lang-(.+)/);
        const language = langMatch?.length > 0 ? langMatch[1] : '';

        var code;

        if (language) {
            var div = document.createElement('div');
            document.body.appendChild(div);
            div.appendChild(node);
            code = node.innerText;
            div.remove();
        } else {
            code = node.innerHTML;
        }

        var fenceChar = options.fence.charAt(0);
        var fenceSize = 3;
        var fenceInCodeRegex = new RegExp('^' + fenceChar + '{3,}', 'gm');

        var match;
        while ((match = fenceInCodeRegex.exec(code))) {
            if (match[0].length >= fenceSize) {
                fenceSize = match[0].length + 1;
            }
        }

        var fence = repeat(fenceChar, fenceSize);

        return (
            '\n\n' + fence + language + '\n' +
            code.replace(/\n$/, '') +
            '\n' + fence + '\n\n'
        );
    }



    turndownService.addRule('pre', {
        filter: (node, tdopts) => node.nodeName == 'PRE' && (!node.firstChild || node.firstChild.nodeName != 'CODE'),
        replacement: (content, node, tdopts) => {
            return convertToFencedCodeBlock(node, tdopts);
        }
    });

    const markdown = turndownService.turndown(html)
    console.log(markdown);
})

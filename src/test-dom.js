const domParser = new DOMParser()

const html = `
<html>
<body>
</body>
</html>`

const dom = domParser.parseFromString(html, 'text/html')

console.log(dom)
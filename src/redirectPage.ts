export default (url: string) => 
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Redirecting...</title>
        <link rel="canonical" href="${url}">
        <script>location = "${url}"</script>
        <meta http-equiv="refresh" content="0;url=${url}">
        <meta name="robots" content="noindex">
    </head>
    <body>
        <h1>Redirecting...</h1>
        <a href="${url}">Click here if you are not redirected.</a>
    </body>
    </html>`;
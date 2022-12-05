export default () => 
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create link</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        body > div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #f3f3f3;
            border-radius: .5rem;
            padding: .625rem;
            border: 1px solid #cecece;
        }

        h1 {
            margin: 10px 50px;
            padding: 0;
        }

        p {
            margin: 0;
            opacity: 0.5;
            font-weight: bold;
        }

        form {
            display: none;
            flex-direction: column;
            width: 100%;
        }

        form > div {
            margin: 0.5rem 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        form label + input {
            margin-top: 3px;
        }

        form input {
            padding: 6px;
            border: 1px solid #cecece;
            border-radius: .375rem;
        }

        div.line {
            max-width: 100%;
            box-sizing: border-box;
            height: 1px;
            margin: 1rem 2rem;
            background-color: #cecece;
        }

        span {
            color: red;
        }

        div.tabs {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 100%;
            margin: 10px;
        }

        div.tabs > input {
            position: absolute;
            opacity: 0;
            pointer-events: none;
        }

        div.tabs > label {
            width: 100%;
            background-color: transparent;
            border: 1px solid #cecece;
            color: black;
            padding: 5px;
            margin: 5px;
            border-radius: 8px;
            text-align: center;
        }
        
        div.tabs > input:checked + label {
            background-color: #f05050;
            color: white;
            border: 0px;
        }

        div#forms {
            width: 100%;
        }

        form.active {
            display: flex;
        }
    </style>
</head>
<body>
    <div>
        <h1>Create a new shortened link</h1>
        <p>Key required</p>
        <div class="tabs">
            <input type="radio" id="createRadio" name="tabs">
            <label for="createRadio">Create</label>
            <input type="radio" id="deleteRadio" name="tabs">
            <label for="deleteRadio">Delete</label>
        </div>
        <div id="forms">
            <form method="post" action="/create">
                <div>
                    <label for="urlinput">Redirect URL</label>
                    <input type="input" name="url" id="urlinput">
                </div>
                <div>
                    <label for="keyinput">Input key</label>
                    <input type="password" name="key" id="keyinput">
                </div>
                <div>
                    <input type="submit" value="Create">
                </div>
            </form>
            <form method="post" action="/delete">
                <div>
                    <label for="idinput">ID</label>
                    <input type="input" name="id" id="idinput">
                </div>
                <div>
                    <label for="keyinput">Input key</label>
                    <input type="password" name="key" id="keyinput">
                </div>
                <div>
                    <input type="submit" value="Delete">
                </div>
            </form>
            <div class="line"></div>
            <span></span>
        </div>
    </div>

    <script>
        const forms = document.querySelectorAll("form");
        const tabs = document.querySelectorAll("input[type=radio]");
        
        const update = (element, index) => {
            const active = document.querySelector("form.active");
            if (active != null) active.classList.remove("active");
            document.querySelectorAll("form")[index].classList.toggle("active");
        }

        tabs.forEach((tab, index) => {
            tab.onclick = (e) => {
                update(e.target, index);
            }
        })

        forms.forEach((form) => {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.target).entries());
                fetch(form.action, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "application/json" }
                }).then(async (res) => {
                    const text = document.querySelector("span");
                    const body = await res.json();

                    if (res.status != 200) {
                        return text.innerText = body.err;
                    }

                    text.style.color = 'green';
                    text.innerHTML = form.action.includes("delete") ? 'Deleted!' : \`Created! <a style="color: #4c8bec;" href="\${location.origin}/\${body.id}">\${location.host}/\${body.id}</a>\`
                })
            };
        });
    </script>
</body>
</html>`;
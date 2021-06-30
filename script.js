const DEST_URL = 'http://localhost:3000'
const HIDDEN_PASSWORD = '***'

const DEFAULT_POST_HEADERS = {
    'Content-Type': 'application/json'
}

const getElements = async () => {
    clearTable()

    const response = await fetch(`${DEST_URL}/get-passwords`)
    const passwords = await response.json()

    const tbody = document.querySelector('#my-table')

    for (const site in passwords) {
        const tr = document.createElement('tr')

        const td1 = document.createElement('td')
        td1.textContent = site

        const td2 = document.createElement('td')
        td2.textContent = '***'

        const showPasswordButton = document.createElement('button')
        showPasswordButton.style = 'float: right'

        showPasswordButton.onclick = () => {
            const password = td2.textContent === HIDDEN_PASSWORD ?
                passwords[site] :
                HIDDEN_PASSWORD

            const button = td2.childNodes[1]
            td2.textContent = password
            td2.appendChild(button)
        }

        td2.appendChild(showPasswordButton)

        tr.appendChild(td1)
        tr.appendChild(td2)

        tbody.appendChild(tr)
    }
}

const clearTable = () => {
    const tbody = document.querySelector('#my-table')
    tbody.innerHTML = ''
}

const createPassword = async () => {
    await fetch(`${DEST_URL}/create-password`, {
        method: 'post',
        headers: DEFAULT_POST_HEADERS,
        body: JSON.stringify({
            site: document.querySelector('#site').value,
            password: document.querySelector('#password').value
        })
    })

    await getElements()
}

window.onload = async () => await getElements()

document.querySelector('#add-new-password').onclick = async () => await createPassword()
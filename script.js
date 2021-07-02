const DEST_URL = 'http://localhost:3000'
const HIDDEN_PASSWORD = '***'
const INTERNAL_SERVER_ERROR = 500

const getPasswords = async () => {
    clearPasswordsTable()

    const response = await fetch(`${DEST_URL}/get-passwords`)
    const passwords = await response.json()

    const tbody = document.querySelector('#my-table')

    for (const site in passwords) {
        const tr = document.createElement('tr')

        const td1 = document.createElement('td')
        td1.textContent = site

        const td2 = document.createElement('td')
        td2.textContent = HIDDEN_PASSWORD

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

const clearPasswordsTable = () => document.querySelector('#my-table').innerHTML = ''

const getTextBoxValue = textBoxId => document.querySelector(`#${textBoxId}`).value

const doPostRequest = async (url, object) => await fetch(url, {
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(object)
})

const addNewPassword = async () => {
    const [site, password] = [getTextBoxValue('site'), getTextBoxValue('password')]

    if (!site || !password) {
        showModal('errorModal', `Enter 'site' and 'password' values`)
        return
    }

    const showUploadNotSuccess = () => showModal('errorModal', 'Uploading new password was not successful.')

    const result = await doPostRequest(`${DEST_URL}/create-password`, {
        site,
        password
    }).catch(_ => showUploadNotSuccess())

    if (result.status === INTERNAL_SERVER_ERROR) {
        showModal('errorModal', `Password for this site already exists.\nPlease use 'change password' button.`)
        return
    }

    if (!result.ok) {
        printUploadNotSuccess()
        return
    }

    await getPasswords()
}

const showAddPasswordArea = () => {
    const area = document.querySelector('#add-password-area')
    area.hidden = !area.hidden
}

const showModal = (modalId, text) => {
    const modal = new bootstrap.Modal(document.querySelector(`#${modalId}`))
    const modalBody = document.querySelector('.modal-body')
    modalBody.innerHTML = ''

    for (const value of text.split('\n')) {
        const modalDiv = document.createElement('div')
        modalDiv.textContent = value
        modalBody.appendChild(modalDiv)
    }

    modal.show()
}

lucide.createIcons();
  const [urlPath, webhookPathId] = window.location.pathname.split('/app')
  const url = window.location.origin + urlPath

  document.getElementById('redirectURL').value = localStorage.getItem('redirectURL')
  document.getElementById('url-link').innerHTML = `${url}/webhook${webhookPathId}/`
  document.getElementById('url-link').href = `${url}/webhook${webhookPathId}/`

  function convertJSONToString(data) {
    try {
      return JSON.stringify(data);
    } catch (e) {
      return data;
    }
  }
  function parseObjectPropToString(obj) {
    const data = JSON.parse(obj)
    for (const key in data) {
      if (typeof data[key] === 'object')
        data[key] = convertJSONToString(data[key]);
    }

    return data;
  }
  function reloadPage() {
    window.location.reload()
  }

  function saveRedirectUrl() {
    const redirectURL = document.getElementById('redirectURL').value
    localStorage.setItem('redirectURL', redirectURL)
  }

  function handleRequest(method, path, query, body, headers) {
    const redirectURL = `${localStorage.getItem('redirectURL')}/${path}`;
    const requestURL = new URL(redirectURL)
    requestURL.search = new URLSearchParams(JSON.parse(query)).toString()

    const request = new Request(requestURL.toString(), {
      method,
      body: ['post', 'put'].includes(method.toLowerCase()) ? body : undefined,
      headers: parseObjectPropToString(headers),
    });
    fetch(request)
      .then((data) => {
      })
      .catch(console.error);
  }

  function showRawData(method, path, query, body, headers) {
    function parseAllObjectsToJSON(data) {
      try {
        const obj = JSON.parse(data);

        for (const key in obj) {
          obj[key] = parseAllObjectsToJSON(obj[key]);
        }

        return obj;
      } catch (e) {
        return data;
      }
    }

    const data = {
      method,
      path,
      query: parseAllObjectsToJSON(query),
      body: parseAllObjectsToJSON(body),
      headers: parseAllObjectsToJSON(headers),
    }
    document.getElementById('req-data').innerHTML = JSON.stringify(data, null, 4)
  }

  function copyToClipboard() {
    const url = document.getElementById('url-link').textContent
    navigator.clipboard.writeText(url)
  }

  function clearData() {
    fetch(`${url}/webhook${webhookPathId}/clear`)
      .then(reloadPage)
      .catch(console.error);
  }
import config from 'envConfig';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('udi-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined'
      ? localStorage.getItem(`udi-${config.site}-authority`)
      : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || [];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem(
    `udi-${config.site}-authority`,
    JSON.stringify(proAuthority)
  );
}

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getToken(str) {
  // return localStorage.getItem('udi-authority') || ['admin', 'user'];
  const tokenString =
    typeof str === 'undefined'
      ? localStorage.getItem(`udi-${config.site}-token`)
      : str;
  // authorityString could be admin, "admin", ["admin"]
  let token;
  try {
    token = JSON.parse(tokenString);
  } catch (e) {
    token = tokenString;
  }
  if (token === 'undefined') {
    return '';
  }
  return token || '';
}

export function setToken(token) {
  return localStorage.setItem(
    `udi-${config.site}-token`,
    JSON.stringify(token || '')
  );
}

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getPartnerId(str) {
  // return localStorage.getItem('udi-authority') || ['admin', 'user'];
  const partnerString =
    typeof str === 'undefined'
      ? localStorage.getItem(`udi-${config.site}-partner`)
      : str;
  // authorityString could be admin, "admin", ["admin"]
  let partner;
  try {
    partner = JSON.parse(partnerString);
  } catch (e) {
    partner = partnerString;
  }
  return partner || '';
}

export function setPartnerId(partner) {
  return localStorage.setItem(
    `udi-${config.site}-partner`,
    JSON.stringify(partner || '')
  );
}

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getSite(str) {
  // return localStorage.getItem('udi-authority') || ['admin', 'user'];
  const siteString =
    typeof str === 'undefined'
      ? localStorage.getItem(`udi-${config.site}-site`)
      : str;
  let site;
  try {
    site = JSON.parse(siteString);
  } catch (e) {
    site = siteString;
  }
  return site || '';
}

export function setSite(site) {
  return localStorage.setItem(
    `udi-${config.site}-site`,
    JSON.stringify(site || '')
  );
}

export function getError(str) {
  const errorString =
    typeof str === 'undefined'
      ? sessionStorage.getItem(`udi-${config.site}-error`)
      : str;
  let error;
  try {
    error = JSON.parse(errorString);
  } catch (e) {
    error = errorString;
  }
  if (typeof error === 'string') {
    return [error];
  }
  return error || [];
}

export function setError(error) {
  const errorData = typeof error === 'string' ? [error] : error;
  return sessionStorage.setItem(
    `udi-${config.site}-error`,
    JSON.stringify(errorData)
  );
}

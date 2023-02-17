/**
 * Crea un archivo Google Sheets
 * @param   { String }  spreadsheetName           Nombre que se quiere colocar al spreadsheet
 * @param   { String }  folderId                  Id de la carpeta donde se quiere colocar el archivo
 * @param   { Blob }    blob                      Blob opcional para insertar datos en el spreadsheet
 * @return  { GoogleAppsScript.Drive.Schema.File }     Archivo creado con los parametros especeficados
 */

/**
 * Envia correo de notificacion de novedad y detencion del bot
 * @param { string } noveltyReason
 * @param { string } observations
 */

const criticalCheckPoint = (referenEmpresarial, novedad,usuarioExperto) => {

  const subject = Params.EMAIL.SUBJECT;
  const htmlBody = `<p>Buenos días,</p>
    <p>Señor(a): </p>    
    <p>${usuarioExperto}</p>
    <p>Me permito informarle que el registro de [ID] de la planilla que corresponde a la
    Referencia empresarial [${referenEmpresarial}] presenta la novedad [${novedad}] por lo tanto no
    puede ser procesado y deberá procesarse manualmente.
    <p>Agradezco hacer el trámite pertinente para poder aplicar el rezago.</p>
    <p>Muchas gracias.´</p>
    `;
  MailApp.sendEmail(Params.EMAIL.RECIPIENT, Params.EMAIL.SUBJECT, htmlBody, {
    htmlBody: htmlBody,
  });
};


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

const novelty = (referenEmpresarial) => {

  const subject = Params.EMAIL.SUBJECT;
  const htmlBody = `<p>Buenos días,</p>
    <p>Señor(a): </p>    
    <p>${Params.EMAIL.EXPERT_USER}</p>
    <p>Me permito informarle que el registro de [ID] de la planilla que corresponde a la
    Referencia empresarial [${referenEmpresarial}] presenta la novedad [El Valor de la referencia no
    coincide con los valores de los registros en Rezagos del día] por lo tanto no
    puede ser procesado y deberá procesarse manualmente.
    <p>Agradezco hacer el trámite pertinente para poder aplicar el rezago.</p>
    <p>Muchas gracias.´</p>
    `;
  MailApp.sendEmail(Params.EMAIL.RECIPIENT, Params.EMAIL.SUBJECT,'', {
    htmlBody: htmlBody,
  });
};

const criticalCheckPoint = (observations) => {
  // Se obtiene fecha de novedad
  const now = getCurrentDateTime();

  const subject = "Asistente Bot Dafuturo - Actualización Rezagos -  Detenido";
  const htmlBody = `<p>Buen día,</p>
    <p>
    En el proceso <strong>DAFUTURO - Actualización rezagos</strong> se generó una 
    novedad en la fecha <strong>[${now[0]} ${now[1]}]</strong>, por tal motivo 
    no se logró finalizar la ejecución del asistente bot.
    </p>

    <p>Observaciones tecnicas (No obligatorias):</p>
    <p>${observations}</p>
    `;
    MailApp.sendEmail(Params.EMAIL.RECIPIENT, subject,'', {
      htmlBody: htmlBody,
    });
};

const getCurrentDateTime = () => {
  const now = new Date();
  const nowFormatted = now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return nowFormatted.split(", ");
};




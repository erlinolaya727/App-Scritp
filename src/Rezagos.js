/**
 * Desarrollador: Erlin Olaya
 * Fecha : 16/02/2022
 * Descripcion: Apps Script cruza referencias y valores de archivo rezagos.CSV y Sheet, si los valores y 
				referencias coinciden se procede a eliminar filas y unificar información de ambos archivos al final del Sheet
*/
function rezagosUpdate() {

	// Se inicializa cuerpo de respuesta
	const body = {}
	let response = {}

	try {
		Logger.log("Inicia ejecución de AppScript");
		// Se busca archivo de rezagos en formato csv
		response = searchRezagoCSV();

		const csvFile = response.body.csvFile;
		const csvData = response.body.csvData;

		// Se verifica si el archivo y el contenido fue encontrado
		Logger.log("Se valida si archivo CSV existe en la ruta");

		if (!csvFile || !csvData) {
			return buildResponse(ResponseStatus.Successful, response.body);
		}

		// Se obtiene los valores del google sheet de rezagos del día 2022
		Logger.log("Se obtiene data de shhet rezagos del día 2022");
		response = getSheetRezagos();
		const sheetValuesRezagos = response.body.sheetValuesRezagos;

		// Se verifica si el proceso fue exitoso
		if (response.status == ResponseStatus.Unsuccessful) {
			return response;
		}


		var seccionRezagosDia = [];
		var seccionRezagosActualizar = [];
		var agregarFilaSheetRezagos2022 = [];
		var valoresAgregar = [];
		var filasEliminar = [];


		Logger.log("Inicia loop para array de la data del archivo CSV");
		for (var x = 0; x <= csvData.length - 1; x++) {
			var referenciaRezagos = csvData[x][Params.UPDATE_REZAGOS.COLUMNA_REFERENCIA_REZAGO];
			var valorRezagos = csvData[x][Params.UPDATE_REZAGOS.COLUMNA_VALOR_REZAGO];

			Logger.log("Inicia loop para array de la data del Sheet Rezagos del día");
			for (var y = 0; y <= sheetValuesRezagos.length - 1; y++) {
				var referenciaSheet = sheetValuesRezagos[y][3];
				var valorSheet = sheetValuesRezagos[y][8];

				if (referenciaRezagos == referenciaSheet && valorRezagos == valorSheet) {
					Logger.log("Se encontró coindidencia de referencias y de valor");
					seccionRezagosDia = sheetValuesRezagos[y].slice(0, 10);
					seccionRezagosActualizar = csvData[x].slice(30, 38);
					valoresAgregar = seccionRezagosDia.concat(seccionRezagosActualizar);
					agregarFilaSheetRezagos2022.push(valoresAgregar);
					filasEliminar.push(referenciaSheet);
				}
			}
		}
		
		//Llamar función para elimiar filas de la hoja de reazagos del día 2022
		Logger.log("Se valida si existen referencias para eliminar por filas");
		if (filasEliminar.length > 0) {
			response=eliminarFilasReferenciasSheet(filasEliminar);
			var resultado= response.body.eliminado;			
			if(resultado){
				Logger.log("Se inicia la función para llenar filas al final de la tabla Sheet rezagos dell día");
				insertarFilasInformacion(agregarFilaSheetRezagos2022);
			}
		}

		body.message = 'Información obtenida exitosamente';
		return buildResponse(ResponseStatus.Successful, body)

	} catch (error) {
		body.message = 'Error en la funcion principal de rezagos' + `${error.stack}`;
		Logger.log(`ERROR - ${body.message}`);
		return buildResponse(ResponseStatus.Unsuccessful, body);
	}
}

//Obtiene el archivo de rezagos csv
const searchRezagoCSV = () => {
	// Se inicializa cuerpo de respuesta
	const body = {}

	Logger.log("Inicia función searchRezagoCSV() para encontrar archivo CSV y data respectiva");
	// Se obtiene la carpeta del archivo CSV de rezagos
	const csvFolder = DriveApp.getFolderById(Params.UPDATE_REZAGOS.CSV_FOLDER_REZAGOS);

	// Se busca reporte archivo CSV de Rezagos
	const fileRezagosCSV = `title contains '${Params.UPDATE_REZAGOS.CSV_NAME}'`;
	const files = csvFolder.searchFiles(fileRezagosCSV);

	// Se obtiene archivo y su contenido si existe alguno
	if (files.hasNext()) {

		Logger.log("INFO - La carpeta contiene un archivo");

		// Se obtiene contenido del archivo 
		const file = files.next();
		const content = file.getBlob().getDataAsString();

		// Se convierte la informacion a un array (2D)
		// y se eliminan encabezados
		const csvData = Utilities.parseCsv(content);
		csvData.splice(0, 1);

		body.message = 'Achivo rezagos e información obtenida';
		body.csvFile = file;
		body.csvData = csvData;

		Logger.log(`INFO - ${body.message}`);
		return buildResponse(ResponseStatus.Successful, body)
	}
	// La carpeta no tiene archivos
	body.message = 'No se encontraron archivos de rezagos para procesar';
	Logger.log(`INFO - ${body.message}`);
	return buildResponse(ResponseStatus.Successful, body);
}

//Obtiene el google sheet donde se importara la informacion del csv
const getSheetRezagos = () => {

	// Se inicializa cuerpo de respuesta
	const body = {
		sheetValuesRezagos: "",
	}

	try {
		// Se obtiene archivo e información de la Sheet de google
		Logger.log("Inicia función getSheetRezagos() para obtener data del Sheet");
		
		var libro = SpreadsheetApp.openById(Params.UPDATE_REZAGOS.ID_SHEET_REZAGOS);
		var hoja = libro.getSheetByName(Params.UPDATE_REZAGOS.NAME_SHEET);
		var lastColumn = hoja.getLastColumn();
		var lastRow = hoja.getLastRow();
		const valores = hoja.getRange(3, 1, lastRow - 2, lastColumn).getValues();

		body.message = 'Archivo e información obtenida';
		body.sheetValuesRezagos = valores;

		return buildResponse(ResponseStatus.Successful, body);

	} catch (error) {
		body.message = 'Se genero un error en la busqueda de la sheet de rezagos del día';
		Logger.log(`Error - ${body.message}. Description: ${error.stack}`);
		return buildResponse(ResponseStatus.Unsuccessful, body);
	}
}

//Eliminar filas de referencias
const eliminarFilasReferenciasSheet = (filasEliminar) => {

	// Se inicializa cuerpo de respuesta
	const body = {
		eliminado: false
	}

	try {
		Logger.log("Inicia función eliminarFilasReferenciasSheet() para eliminar fila");

		var libro = SpreadsheetApp.openById(Params.UPDATE_REZAGOS.ID_SHEET_REZAGOS);
		var hoja = libro.getSheetByName(Params.UPDATE_REZAGOS.NAME_SHEET);
		var columnReference = Params.UPDATE_REZAGOS.ID_REFERENCE_COLUMN_SHEET;
		var data = hoja.getDataRange().getValues();

		Logger.log("Se itera los datos por las referencias a eiliminar");
		for (var i = data.length - 1; i >= 0; i--) {
			if (filasEliminar.includes(data[i][columnReference - 1])) {
				hoja.deleteRow(i + 1);
			}
		}
		body.message = 'Filas Eliminadas con éxito';
		body.eliminado=true;

		return buildResponse(ResponseStatus.Successful, body);
	} catch (error) {		
		body.message = 'Se genero un error al momento de eliminar las filas de la hoja de rezagos';
		Logger.log(`Error - ${body.message}. Description: ${error.stack}`);
		return buildResponse(ResponseStatus.Unsuccessful, body);
	}
}

//Rellenar filas al final del sheet
const insertarFilasInformacion = (newRows) => {

	// Se inicializa cuerpo de respuesta
	const body = {}

	try {
		Logger.log("Inicia función insertarFilasInformacion() agregar las nuevas filas del archivo rezago");
		var libro = SpreadsheetApp.openById(Params.UPDATE_REZAGOS.ID_SHEET_REZAGOS);
		var hoja = libro.getSheetByName(Params.UPDATE_REZAGOS.NAME_SHEET);
		var rows=newRows.length;
		var columns= newRows[0].length;
		var lastRowSheet= hoja.getLastRow();
		hoja.insertRowsAfter(lastRowSheet, rows);
		var rangeNewRows = hoja.getRange(lastRowSheet+1,1,rows,columns);
		rangeNewRows.setValues(newRows);

		body.message = 'Filas Agregadas con éxito';
		return buildResponse(ResponseStatus.Successful, body);
	} catch (error) {
		body.message = 'Se genero un error al momento de agregar neuvas las filas de la hoja de rezagos';
		Logger.log(`Error - ${body.message}. Description: ${error.stack}`);
		return buildResponse(ResponseStatus.Unsuccessful, body);
	}
}
/**
 * @enum
 * Parametros de ejecucion del apps script
 */
const Params = {

	UPDATE_REZAGOS:{
		CSV_FOLDER_REZAGOS: '1s8gPZFtjtRolk5KAE0ligMRlAan-ftXv', //Folder de Rezagos actualizar
		CSV_NAME: 'rezagosActualizar', //Nombre archivo rezagos actualizar
		BACKUP_CSV_FOLDER: '1XdcJ2beyXERf2QsGbOvqzpccPoNDUIgm', //Archivos procesados Backup
		COLUMNA_VALOR_REZAGO: '1',
		COLUMNA_REFERENCIA_REZAGO: '0',
		ID_SHEET_REZAGOS:'1jzWd7qeycrRAVyY46yTA3Ve_UOAVYmt6wrlLANHuxRY',
		NAME_SHEET: 'REZAGO DEL DIA',
		ID_REFERENCE_COLUMN_SHEET:'4',
		VALOR_COLUMN_SHEET:'9',		
		POSICION_REZAGOS_ACTUALIZAR:'30',
	},
	EMAIL:{
		SUBJECT:'Registro con novedad - No encontrado en rezagos',
		RECIPIENT:'erlin.olaya@trycore.com.co',
		NOVELTY_NO_FILE:'no se encuentra en el archivo “Rezagos del día',
		NOVELTY_REFERENCE:'el Valor de la referencia no Coincide con los valores de los registros en Rezagos del día',
		EXPERT_USER:'',
	}
	
}
import { stdout as slog } from "single-line-log";
import { getLogger, Logger } from "log4js";
import process from "process";


export default class Progress {
	private logger: Logger = getLogger( "[progress]" );
	
	constructor(
		private description: string,
		private total: number,
		private length: number = 50
	) {
	}

	
	public setTotal( val: number ) {
		this.total = val;
	}
	// 三四十，满脑子搁这向上爬呢
	public renderer( completed: number, rightText: ( total: number ) => string = () => "", tcp: boolean = false ) {
		const cellNum: number = Math.floor( completed / this.total * this.length );
		
		const processStr: string = Array.from( { length: this.length }, ( _, index ) => {
			return index < cellNum ? "█" : "░";
		} ).join( "" );
		
		const cmdText = `${ this.description }: ${ processStr }  ${ rightText( this.total ) }`;
		
		if ( tcp ) {
			this.logger.info( cmdText );
		}
		if ( process.env.RUN_TYPE !== "pm2" ) {
			// 在单行输出文本
			slog( cmdText );
			// 终止后打印换行符
			if ( processStr.length === cellNum ) {
				console.log( "" );
			}
		}
	}
}
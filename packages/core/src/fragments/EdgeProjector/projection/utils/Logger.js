// Minimal logger for tracking main processing steps
// Only tracks overall step times - no per-object logging to avoid performance impact

let enabled = false;
const stepTimes = {};
const stats = {};
let currentStep = null;
let currentStepStart = 0;
let totalStart = 0;

export const Logger = {

	get enabled() {

		return enabled;

	},

	set enabled( value ) {

		enabled = value;

	},

	reset() {

		for ( const key in stepTimes ) {

			delete stepTimes[ key ];

		}

		for ( const key in stats ) {

			delete stats[ key ];

		}

		currentStep = null;
		currentStepStart = 0;
		totalStart = 0;

	},

	setStat( name, value ) {

		stats[ name ] = value;

	},

	startTotal() {

		if ( ! enabled ) return;
		totalStart = performance.now();

	},

	startStep( name ) {

		if ( ! enabled ) return;

		// End previous step if any
		if ( currentStep !== null ) {

			this.endStep();

		}

		currentStep = name;
		currentStepStart = performance.now();

	},

	endStep() {

		if ( ! enabled || currentStep === null ) return;

		const elapsed = performance.now() - currentStepStart;
		stepTimes[ currentStep ] = elapsed;
		currentStep = null;

	},

	printSummary() {

		if ( ! enabled ) return;

		// End any ongoing step
		if ( currentStep !== null ) {

			this.endStep();

		}

		const totalTime = performance.now() - totalStart;

		console.log( '\n=== Projection Summary ===' );
		console.log( `Total time: ${ totalTime.toFixed( 1 ) }ms\n` );

		for ( const [ step, time ] of Object.entries( stepTimes ) ) {

			const pct = ( ( time / totalTime ) * 100 ).toFixed( 1 );
			console.log( `  ${ step }: ${ time.toFixed( 1 ) }ms (${ pct }%)` );

		}

		if ( Object.keys( stats ).length > 0 ) {

			console.log( '\n--- Stats ---' );
			for ( const [ key, value ] of Object.entries( stats ) ) {

				console.log( `  ${ key }: ${ value }` );

			}

		}

		console.log( '' );

	}

};

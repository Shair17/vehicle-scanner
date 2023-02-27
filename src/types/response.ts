export interface DecodedVIN {
	Count: number;
	Message: string;
	SearchCriteria: string;
	Results: { [key: string]: string }[];
}

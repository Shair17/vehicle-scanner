import axios from 'axios';
import { DecodedVIN } from '../types/response';

// https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValues/1C4RJFAG6FC165366?format=json

export const http = axios.create({
	baseURL: 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValues',
});

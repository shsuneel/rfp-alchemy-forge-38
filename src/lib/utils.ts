import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";
import pptJSON from "./ppt.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generatePPTX(data): Promise<string> {
  const uri: string = 'http://localhost:3020/py/ppt';
  const ppt = await axios.post(uri,
    data,
    {
      responseType: 'blob' // Ensure the response is a Blob
    }
  );


  const blob = ppt.data as Blob;
  return window.URL.createObjectURL(blob);
}



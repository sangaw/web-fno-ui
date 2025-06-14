export interface Position {
  id: number;
  product: string;
  instrument: string;
  quantity: number;
  averagePrice: number;
  lastTradedPrice: number;
  pnl: number;
  change: number;
}

export const parseCSV = (csvData: string): Position[] => {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    return {
      id: index + 1,
      product: values[0],
      instrument: values[1],
      quantity: parseFloat(values[2]),
      averagePrice: parseFloat(values[3]),
      lastTradedPrice: parseFloat(values[4]),
      pnl: parseFloat(values[5]),
      change: parseFloat(values[6]),
    };
  });
}; 
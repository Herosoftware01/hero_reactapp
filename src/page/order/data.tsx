
export const employeeData = [
  { EmployeeID: 1, FirstName: 'Nancy', Title: 'Sales Representative', HireDate: new Date('1992-05-01'), ReportsTo: 2 },
  { EmployeeID: 2, FirstName: 'Andrew', Title: 'Vice President', HireDate: new Date('1992-04-01'), ReportsTo: null },
  { EmployeeID: 3, FirstName: 'Janet', Title: 'Sales Manager', HireDate: new Date('1992-08-14'), ReportsTo: 2 },
  { EmployeeID: 4, FirstName: 'Margaret', Title: 'Sales Representative', HireDate: new Date('1993-05-03'), ReportsTo: 3 },
];

export const orderDatas = [
  { OrderID: 10258, EmployeeID: 1, CustomerID: 'ERNSH', ShipCity: 'Graz', Freight: 140.51, ShipName: 'Ernst Handel' },
  { OrderID: 10259, EmployeeID: 1, CustomerID: 'ALFKI', ShipCity: 'Berlin', Freight: 76.07, ShipName: 'Toms Spezialitäten' },
  { OrderID: 10260, EmployeeID: 3, CustomerID: 'ANATR', ShipCity: 'London', Freight: 45.32, ShipName: 'Around the Horn' },
  { OrderID: 10261, EmployeeID: 4, CustomerID: 'BERGS', ShipCity: 'Madrid', Freight: 33.93, ShipName: 'Berglunds snabbköp' },
];

export const customerData = [
  { CustomerID: 'ERNSH', ContactName: 'Roland Mendel', Address: 'Kirchgasse 6', Country: 'Austria' },
  { CustomerID: 'ALFKI', ContactName: 'Maria Anders', Address: 'Obere Str. 57', Country: 'Germany' },
  { CustomerID: 'ANATR', ContactName: 'Ana Trujillo', Address: 'Avda. de la Constitución 2222', Country: 'Mexico' },
  { CustomerID: 'BERGS', ContactName: 'Christina Berglund', Address: 'Berguvsvägen 8', Country: 'Sweden' },
];

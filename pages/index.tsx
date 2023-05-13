import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import React, { useMemo, useState } from 'react';
import MaterialReactTable, { type MaterialReactTableProps, type MRT_Cell, type MRT_ColumnDef } from 'material-react-table';
import * as fs from 'node:fs/promises';
import { toast } from 'react-toastify';
import { Button, Container } from '@mui/material';
import { Spacer } from '@nextui-org/react';
import { Typography } from '@mui/material';

type Person = {

  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  income: number;
  expenses: number;
  balance: number;
};

var Home = ( {peopleList} ) => {
  //should be memoized or stable
  
  var columns1 = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName', //access nested data with dot notation
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ],
    [],
  );

  var columns2 = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName', //access nested data with dot notation
        header: 'First Name',
        muiTableBodyCellEditTextFieldProps: {
          required: true,
          type: 'text',
          disabled: true,
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        muiTableBodyCellEditTextFieldProps: {
          type: 'text',
          onBlur: (event ) => {
            console.log("Blur" , event.target.value);  
            toastSuccess();
          },
        },
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ],
    [],
  );

  var columns3 = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName', //access nested data with dot notation
        header: 'First Name',
        muiTableBodyCellEditTextFieldProps: {
          type: 'text',
          disabled: true,
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        muiTableBodyCellEditTextFieldProps: {
          type: 'text',
          disabled: true,
        },
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
        muiTableBodyCellEditTextFieldProps: {
          type: 'text',
          disabled: true,
        },
      },
      {
        accessorKey: 'city',
        header: 'City',
        muiTableBodyCellEditTextFieldProps: {
          type: 'text',
          disabled: true,
        },
      },
      {
        accessorKey: 'state',
        header: 'State',
        muiTableBodyCellEditTextFieldProps: {
          type: 'text',
          disabled: true,
        },
      },
      {
        accessorKey: 'income',
        header: 'Income',
        // muiTableBodyCellEditTextFieldProps: ({cell}) => ({
        //   type: 'text',
        //   onChange: (event ) => {
        //     cell.row.getAllCells().forEach((cell: MRT_Cell<Person>) => {
        //       var expenses;
        //       var balance: unknown;
        //       if(cell.column.id === 'expenses'){
        //         expenses = Number(cell.getValue());console.log(cell.getValue())//console.log("expenses" , expenses, "event.target.value" , Number(event.target.value));
        //         balance = Number(event.target.value) - expenses;console.log("balance" , balance);
        //       }

        //       if(cell.column.id === 'balance'){console.log("Entrando")
        //         cell.column.accessorFn = (person: Person) => person.income - person.expenses;
        //         console.log(cell.getValue())
        //       }
        //       if(cell.column.id === 'income'){
        //         console.log("El valor es:",cell.getValue())
        //       }
              
              
        //     });
        //     console.log("onChange" , cell.row.getAllCells());
        //   },
        // }),
      },
      {
        accessorKey: 'expenses',
        header: 'Expenses',
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        },
      },
      {
        accessorFn: (person: Person) => person.income - person.expenses,
        accessorKey: 'balance',
        header: 'Balance',
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        },
      }
    ],
    [],
  );

  const [tableData, setTableData] = useState<Person[]>(() => peopleList);
  const [tableData3, setTableData3] = useState<Person[]>(() => peopleList);

  function toastSuccess() {
    toast.success(" Guardando... ", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      progress: undefined,
      theme: "colored",
      draggable: true,
      pauseOnHover: true,
    });
  }

  const handleSaveRow: MaterialReactTableProps<Person>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
      toastSuccess();
      tableData[row.index] = values;
      //send/receive api updates here
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode
    };

    const handleSaveCell = (cell: MRT_Cell<Person>, value: string) => {
      //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here
      tableData3[cell.row.index][cell.column.id as keyof Person] = value;
      var expenses: number;
      var income: number;
      var balance: number;
      cell.row.getAllCells().forEach((innerCell: MRT_Cell<Person>) => {
        
        if(innerCell.column.id === 'income'){
          income = Number(innerCell.getValue());
          console.log("income:",innerCell.getValue())
        }
        if(innerCell.column.id === 'expenses'){
          expenses = Number(innerCell.getValue());
          console.log("expenses:",innerCell.getValue())
        }

        if(innerCell.column.id === 'balance'){
          balance = income - expenses;
          tableData3[innerCell.row.index][innerCell.column.id as keyof Person] = balance.toString();
          console.log("balance" , balance);
        }
      });
      // cell.column.id = 'balance'
      console.log(tableData3)
      //send/receive api updates here
      setTableData3([...tableData3]); //re-render with new data
    };

  return <>
    <MaterialReactTable 
      columns={columns1} 
      data={tableData}
      editingMode = "row"
      enableEditing 
      onEditingRowSave={handleSaveRow}
    />
    <Spacer y={2} />
    <Spacer y={2} />
    <MaterialReactTable 
      columns={columns2} 
      data={peopleList ?? []}
      editingMode = "table"
      enableEditing
    />
    <Spacer y={2} />
    <MaterialReactTable 
      columns={columns3} 
      data={tableData3}
      editingMode = "table"
      enableEditing
      muiTableBodyCellEditTextFieldProps={({ cell }) => ({
        //onBlur is more efficient, but could use onChange instead
        onBlur: (event) => {
          handleSaveCell(cell, event.target.value);
        },
        variant: 'outlined',
      })}
    />
  </>;
};

export default Home;

export async function getStaticProps() {
  const peopleArray = await fs.readFile("./people/people.json", 'utf8')
  const people = JSON.parse(peopleArray)
  const peopleList: Person[] = people as Person[]

  return {
    props: {
      peopleList,
    }
  }
}

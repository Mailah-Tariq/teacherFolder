import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../components/ui/table"
  
  interface PLO {
    id: number
    description: string
  }
  
  interface PLOTableProps {
    plos: PLO[]
  }
  
  export function PLOTable({ plos }: PLOTableProps) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plos.map((plo) => (
            <TableRow key={plo.id}>
              <TableCell>{plo.id}</TableCell>
              <TableCell>{plo.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  
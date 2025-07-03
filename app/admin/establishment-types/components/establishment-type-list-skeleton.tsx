import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/presentation/components/ui/table";

export function EstablishmentTypeListSkeleton() {
    return (
        <Table>
            <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={4}>
                            <div className="h-6 w-full animate-pulse bg-muted" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

import { Card, CardBody, CardHeader } from "@heroui/react"
import { TbBellCheck } from "react-icons/tb";

interface CardProps {
    typeNotif : "CRUD" | "Booking" | "Lainya"
}

const HistoryCard = ({typeNotif} : CardProps) => {
  return (
    <Card>
        <CardBody>
            <CardHeader>
                {typeNotif === "CRUD" ? <h1>Berhasil Menambah Data</h1>
                 : typeNotif === "Booking" ? "Booking" : "Lainya"}
            </CardHeader>
            <div className="flex items-center gap-2">
                <TbBellCheck size={20} />
            <h1>History test</h1>
            </div>
        </CardBody>
    </Card>
  )
}

export default HistoryCard
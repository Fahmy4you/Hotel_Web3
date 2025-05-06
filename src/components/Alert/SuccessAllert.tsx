import { Alert } from "@heroui/react";


export default function SuccessAlert() {
    return (
        <Alert
        title="Success"
        description="User Created"
        color="success"
        className="w-full max-w-sm mx-auto mt-4"
        />
    );
}
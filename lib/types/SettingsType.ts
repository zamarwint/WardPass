export default interface Settings {
    id: string
    autoLockTimeInMinutes: number;
    hiddenTabTimeoutInMinutes: number;

    userId: string
    createdAt: Date
    updatedAt: Date
}
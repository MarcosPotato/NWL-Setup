export const generateProgressPercentPage = (total: number, current: number) => {
    return total > 0 ? Math.round((current/total) * 100) : 0
}
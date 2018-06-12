expect.extend({ toContainHeaders });

function toContainHeaders(command, headers) {
    Object.keys(headers).forEach((key) => {
        if (command.indexOf(`--header ${key} ${headers[key]}`) !== -1) {
            return {
                pass: false,
                message: () => `Header '${key}' with value '${headers[key]}' not found in command.`
            };
        }
    });
    return {
        pass: true,
        message: () => ''
    };
}

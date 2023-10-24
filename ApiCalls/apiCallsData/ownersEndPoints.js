ownersEndPoints = {
    "/api2/owners/api-key/add":
    [],
    "/api2/owners/api-key/toggle":
    [
        {
            "key_to_toggle":
            [
                "str",
                "( API Key )"
            ]
        },
        {
            "is_enabled":
            [
                "bool",
                "1 ( 0 = false / 1 = true )"
            ]
        }
    ],
    "/api2/owners/api-key/delete":
    [
        {
            "key_to_delete":
            [
                "str",
                "( API Key )"
            ]
        }
    ]
}
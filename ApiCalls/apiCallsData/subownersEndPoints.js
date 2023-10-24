subownersEndPoints = {
    "/api2/subowners/create":
    [
        {
            "username":
            [
                "str",
                "(subowner username)"
            ]
        },
        {
            "password":
            [
                "str",
                "(subowner password)"
            ]
        },
        {
            "permissions":
            [
                "array",
                "(permissions to grant)"
            ]
        }
    ],
    "/api2/subowners/get":
    [
        {
            "id":
            [
                "str",
                "(subowner string)"
            ]
        }
    ],
    "/api2/subowners/list":
    [
        {
            "subowners":
            [
                "array",
                "Subowner objects (each is like subowners/get response)"
            ]
        }
    ],
    "/api2/subowners/update":
    [
        {
            "id":
            [
                "str",
                "Subowner ID"
            ]
        },
        {
            "password":
            [
                "str",
                "(new password)"
            ]
        },
        {
            "permissions":
            [
                "array",
                "(permissions greanted)"
            ]
        },
        {
            "newkey":
            [
                "int",
                "1 (creates new API Key)"
            ]
        }
    ],
    "/api2/subowners/delete":
    [
        {
            "id":
            [
                "str",
                "Subowner ID"
            ]
        }
    ]
}
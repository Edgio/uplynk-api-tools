liveEventEndPoints = {
    "/api2/liveevents2/list":
    [
        {
            "limit":
            [
                "int",
                "5"
            ]
        },
        {
            "skip":
            [
                "int",
                "2"
            ]
        },
        {
            "start":
            [
                "int",
                "1672531201000"
            ]
        },
        {
            "stop":
            [
                "int",
                "1672531201000"
            ]
        },
        {
            "order":
            [
                "str",
                "desc  (desc, created, lastmod, expected_start, external_id, operator)"
            ]
        },
        {
            "fields":
            [
                "str",
                "lastmod  (desc, created, lastmod, expected_start, external_id, operator)"
            ]
        }
    ],
    "/api2/liveevents2/get":
    [
        {
            "id":
            [
                "str",
                "887bdf3430f542fd983ccea986eb81f2  (event id)"
            ]
        },
        {
            "external_id":
            [
                "str",
                "ExtVideo8943"
            ]
        },
        {
            "ids":
            [
                "array",
                "887bdf3430f542fd983ccea986eb81f2;9615780430f542fd983ccea986eb81f2"
            ]
        },
        {
            "external_ids":
            [
                "array",
                "ExtVideo8943;IntVideo4589"
            ]
        },
        {
            "fields":
            [
                "str",
                "id,expected_start,desc"
            ]
        }
    ],
    "/api2/liveevents2/create":
    [
        {
            "auto_start_stop":
            [
                "bool",
                "0 (or) 1"
            ]
        },
        {
            "autoexpire_hours":
            [
                "int",
                "24"
            ]
        },
        {
            "desc":
            [
                "str",
                "New Event"
            ]
        },
        {
            "embed_domains":
            [
                "str",
                "example.com,*.example.org'"
            ]
        },
        {
            "expected_start":
            [
                "array/int",
                "2023-04-28;12:00  (utc)"
            ]
        },
        {
            "expected_stop":
            [
                "array/int",
                "2023-04-28;14:00  (utc)"
            ]
        },
        {
            "external_id":
            [
                "str",
                "New ExternalID"
            ]
        },
        {
            "marker_template":
            [
                "str",
                "new marker template (case-sensitive name)"
            ]
        },
        {
            "meta":
            [
                "obj",
                "type:footbal;tournament:6 Nations"
            ]
        },
        {
            "mid_slate_library":
            [
                "str",
                "5f30058293d4456f83203373da267b55  (id of library)"
            ]
        },
        {
            "operator":
            [
                "str",
                "ds45f61f8fb04554ad4aabba3757c9a4 (operators GUID)"
            ]
        },
        {
            "post_slate":
            [
                "str",
                "87a1ec1be4cb4d449723349c1c8630ca  (asset id)"
            ]
        },
        {
            "pre_slate":
            [
                "str",
                "87a1ec1be4cb4d449723349c1c8630ca  (asset id)"
            ]
        },
        {
            "require_drm":
            [
                "bool",
                "0 (or) 1"
            ]
        },
        {
            "require_studio_drm":
            [
                "bool",
                "0 (or) 1"
            ]
        },
        {
            "slicers":
            [
                "obj",
                "id:rtmp1,owner:dabf10f8fb04996ad9eaaac3757c9a4;\nid:test2,owner:dabf10f8fb04996ad9eaaac3757c9a4"
            ]
        },
        {
            "state":
            [
                "str",
                "pre  (pre, post, slate, slicing)"
            ]
        },
        {
            "vod_autoexpire_hours":
            [
                "int",
                "24"
            ]
        },
        {
            "vod_replayable":
            [
                "bool",
                "0 (or) 1"
            ]
        }
    ],
    "/api2/liveevents2/update":
    [
        {
            "id":
            [
                "str",
                "887bdf3430f542fd983ccea986eb81f2  (event id)"
            ]
        },
        {
            "ad_pods":
            [
                "obj",
                "(list of objects)"
            ]
        },
        {
            "auto_start_stop":
            [
                "bool",
                "0 (or) 1"
            ]
        },
        {
            "autoexpire_hours":
            [
                "int",
                "24"
            ]
        },
        {
            "desc":
            [
                "str",
                "New Event"
            ]
        },
        {
            "embed_domains":
            [
                "str",
                "example.com,*.example.org'"
            ]
        },
        {
            "expected_start":
            [
                "int",
                "2023-04-28;12:00  (utc)"
            ]
        },
        {
            "expected_stop":
            [
                "int",
                "2023-04-28;14:00  (utc)"
            ]
        },
        {
            "external_id":
            [
                "str",
                "New ExternalID"
            ]
        },
        {
            "marker_template":
            [
                "str",
                "new marker template (case-sensitive name)"
            ]
        },
        {
            "meta":
            [
                "obj",
                "type:footbal;tournament:6 Nations"
            ]
        },
        {
            "mid_slate_library":
            [
                "str",
                "5f30058293d4456f83203373da267b55  (id of library)"
            ]
        },
        {
            "operator":
            [
                "str",
                "ds45f61f8fb04554ad4aabba3757c9a4 (operators GUID)"
            ]
        },
        {
            "post_slate":
            [
                "str",
                "87a1ec1be4cb4d449723349c1c8630ca  (asset id)"
            ]
        },
        {
            "missing_content_slate":
            [
                "str",
                "87a1ec1be4cb4d449723349c1c8630ca  (asset id)"
            ]
        },
        {
            "pre_slate":
            [
                "str",
                "87a1ec1be4cb4d449723349c1c8630ca  (asset id)"
            ]
        },
        {
            "require_drm":
            [
                "bool",
                "0 (or) 1"
            ]
        },
        {
            "require_studio_drm":
            [
                "bool",
                "0 (or) 1"
            ]
        },
        {
            "slicers":
            [
                "obj",
                "id:rtmp1,owner:ce41f60f8fb04996ad9eaaac3757c9a4;\nid:test2,owner:ce41f60f8fb04996ad9eaaac3757c9a4"
            ]
        },
        {
            "state":
            [
                "str",
                "pre  (pre, post, slate, slicing)"
            ]
        },
        {
            "vod_autoexpire_hours":
            [
                "int",
                "24"
            ]
        },
        {
            "vod_replayable":
            [
                "bool",
                "0 (or) 1"
            ]
        }
    ],
    "/api2/liveevents2/delete":
    [
        {
            "id":
            [
                "str",
                "887bdf3430f542fd983ccea986eb81f2"
            ]
        },
        {
            "external_id":
            [
                "str",
                "ExtVideo8943"
            ]
        },
        {
            "ids":
            [
                "array",
                "887bdf3430f542fd983ccea986eb81f2;9615780430f542fd983ccea986eb81f2"
            ]
        },
        {
            "external_ids":
            [
                "array",
                "ExtVideo8943;IntVideo4589"
            ]
        }
    ],
    "/api2/liveevents2/operator/list":
    [],
    "/api2/liveevents2/slate/list":
    [
        {
            "slate_type":
            [
                "str",
                "pre (pre, mid, post, missing_content, ad)"
            ]
        }
    ],
    "/api2/liveevents2/ancillary-assets":
    [
        {
            "id":
            [
                "str",
                "887bdf3430f542fd983ccea986eb81f2"
            ]
        },
        {
            "since":
            [
                "str",
                "1672531201000"
            ]
        }
    ]
}
// The music player seen in
// 2016: A Lifetime of This.
(function () {
    'use strict';

    // The songs.
    const SONGS_DATA = [
        { title: "Soldier of Love", artist: "Sade", coverLink: "https://lh3.googleusercontent.com/1Zb3jhBGUQHrDU6mZHOk-FGPC1mVg-AMls-bJOQBf9Wx3lG31KTbmbdUtlnkAYbsdao-b1cmXvs1tJET=w544-h544-l90-rj", videoIds: ["zI8YIzWltHM"] },
        { title: "Nothing Compares 2 U", artist: "Prince", coverLink: "https://i.discogs.com/DQEHxJMMCoAozW-09RSF-12sMKCgHB5aGco8kax0sBg/rs:fit/g:sm/q:90/h:595/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI1MDQz/Nzk3LTE2Njc2OTc0/OTktMTY2NC5qcGVn.jpeg", videoIds: ["wyo74f6NWwY"] },
        { title: "Everything Is Wrong", artist: "Interpol", coverLink: "https://i.discogs.com/fajuUIPd6pzjV9sS_CLJz4f0okmvlmKvHVKGzS_--Nw/rs:fit/g:sm/q:90/h:600/w:598/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTY5MTMx/NzctMTQyOTQ1Nzcx/MS0yMTU4LmpwZWc.jpeg", videoIds: ["4llZXppdjCU", "NiraiT0a4Rs"] },
        { title: "Blank Generation", artist: "Richard Hell", coverLink: "https://lh3.googleusercontent.com/hDrqJI4nOVwtWGnqd2OEPmUivA50Gp19YuJPly6DUau8VTExM5MtiFezXmTiKkcGJMEQxDMrBzkz6W4=w544-h544-l90-rj", videoIds: ["v9FkQLjOSZ8"] },
        { title: "Girl Gone Wild", artist: "Madonna", coverLink: "https://lh3.googleusercontent.com/aCpQ5ecu6iU88aQrTkg_gk9vhhGO4sgr79Rwg55s2NQNnhuiR1X1FcBp8PZnQoe2kxtayZghDuZgFPrO=w544-h544-l90-rj", videoIds: ["9Hyzn5XQ-ro"] },
        { title: "Feels Just Like it Should", artist: "Jamiroquai", coverLink: "https://lh3.googleusercontent.com/Syc0T0hpUCioc8Ky5irJxhnSLOavM4gnWjVkVCeW8IUlB2v8i-xJEkyUcmumDoojHjIV_e0vtjmdnQY=w544-h544-l90-rj", videoIds: ["tBZqSRqFQz0"] },
        { title: "You Bring On The Sun", artist: "Londonbeat", coverLink: "https://i.discogs.com/Do-mEAKVHtQa8RsjOI1sX2cMf4Kadbmbjj9TG9GlT94/rs:fit/g:sm/q:90/h:595/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI2Njgy/NjktMTM4NjA4NDIx/OS00NzEyLmpwZWc.jpeg", videoIds: ["WEBS80vNEWY", "1dsdVlkkuzk"] },
        { title: "I Wanna Be Adored", artist: "The Stone Roses", coverLink: "https://lh3.googleusercontent.com/gsnCII7GsI0y6dG9-dvrtIgwFVqP1UTKgE4aX0cHaQ4JKyO83D8d8xGr15fWn3WtiC4e5xQdGe6vnkdxww=w544-h544-l90-rj", videoIds: ["aa10yl8mirk"] },
        { title: "John the Revelator", artist: "Depeche Mode", coverLink: "https://lh3.googleusercontent.com/xf-alOlvnf8xpIHXwd7HiYCbMeSKiqOVbNqN__o7gAtZ7RtyoHO67G-0tKozXtLZMtGc-GctM2PF24Tv=w544-h544-l90-rj", videoIds: ["ZHI2tInxT0A"] },
        { title: "Cult of Personality", artist: "Living Color", coverLink: "https://lh3.googleusercontent.com/1xH4wgpS-Xp2-KM6fqu3R1qE6yd0Sl83SOT5VqdMrOf0RiLk2HDFJaGBgCNKcEPZ9fb6JOBsYlmI0Wp7=w544-h544-l90-rj", videoIds: ["8mssfWohiig"] },
        { title: "Youth Of The Nation", artist: "P.O.D.", coverLink: "https://i.discogs.com/FKbXiFnp0Cuz3BUdSumcuerXH3yhDsmowUGS-FB95jM/rs:fit/g:sm/q:90/h:600/w:591/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTU4OTE0/Ny0xMjExMTI4NzA4/LmpwZWc.jpeg", videoIds: ["Pb7Kg1hT-1A"] },
        { title: "Too Much Love", artist: "LCD Soundsystem", coverLink: "https://lh3.googleusercontent.com/OT3SutN5ptlnj-fQGc2LSuikM1tbKv2RsRf6jRLh9xqYLn62DiSSZyjQ4SdQVgrCmE2JCX4Si5f4XyIr=w544-h544-l90-rj", videoIds: ["CcEC5r0xzt8"] },
        { title: "Natural One", artist: "The Folk Implosion", coverLink: "https://i.discogs.com/TZXSFqXeiXbmoeH31CKTeIB5C-Eo2UeCBTQ86bC_cvI/rs:fit/g:sm/q:90/h:527/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ5ODk5/LTEzMzUzMDExMDku/anBlZw.jpeg", videoIds: ["V4w6GcCoTPQ"] },
        { title: "Haunt You Every Day (Demo)", artist: "Weezer", coverLink: "https://i.ytimg.com/vi/VNoRB57yLak/maxresdefault.jpg", videoIds: ["VNoRB57yLak", "JMYJ-gxlKwc"] },
        { title: "Gardenhead / Leave Me Alone", artist: "Neutral Milk Hotel", coverLink: "https://lh3.googleusercontent.com/Cy-w6XXRmh7yLUKglZ05FpdEAu_ySP98JS85JFCuRbMOp2SbJn73CMZ-ngGY5WxeSOGMLx3-CLAL_uPg=w544-h544-l90-rj", videoIds: ["svxUvcwFYBs", "_s41RrvH1lQ"] },
        { title: "Always", artist: "Tom Verlaine", coverLink: "https://i.discogs.com/eYXKSCUz7FhVLBuyhUc_-sG8yrEVtbeBtMoA4Gv7ffw/rs:fit/g:sm/q:90/h:597/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI4NzIx/OTUtMTMwNDk4NDYw/OS5qcGVn.jpeg", videoIds: ["9X8SEnCGCKE"] },
        { title: "Well I Wonder", artist: "The Smiths", coverLink: "https://lh3.googleusercontent.com/3MqgtN5ZbbMB48TGTkHnlHTRlHNh1SVy_8MN-LByI4iAT-cza4eGiuFvPT243IyyEz0vSaItp432DgU=w544-h544-l90-rj", videoIds: ["zUbCkPdBNHg"] },
        { title: "The Killing Moon", artist: "Echo & The Bunnymen", coverLink: "https://lh3.googleusercontent.com/mbomD0JAl6L_sVTLgSesBNqD0A_roeGlh9ciz_Tq0qaL-ojnaFmx_MY5aWfVQwYx6LD01451ex6XhIE=w544-h544-l90-rj", videoIds: ["aVD1HRV8NqA"] },
        { title: "You Have Been Loved", artist: "George Michael", coverLink: "https://i.discogs.com/XDh2r_xwLYty258j7oROTAqxqCLtj65gwRLGY_v6dV8/rs:fit/g:sm/q:90/h:538/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQzMzE3/OS0xNDcxMzkwMTIw/LTU5MjAuanBlZw.jpeg", videoIds: ["SXRz-ZT0MIE"] }
    ];
    const PLAYLIST_TWO_DATA = [
        { title: "Stronger Than Me", artist: "Amy Winehouse", coverLink: "https://lh3.googleusercontent.com/ERQwzDcTEBrcy8aUU0s-NcYnbcgJOu_-BwBB-A4Z_nRrtbfS2BhMqTovWvLSIfjAtJD_RERUokB2ze_-=w544-h544-l90-rj", videoIds: ["eQpINcpE-Wo", "6N6IjW-2fb4"] },
        { title: "We Don’t Have That Much Time Together", artist: "Sananda Maitreya", coverLink: "https://lh3.googleusercontent.com/vhd98YlgS1Sh4FCmoJ3e2zi4eyAnOtKjp-aiNpcxJ94eYA-VAzAUMPwuQ1aI_MctD18JXtdPP8Rky0tj_g=w544-h544-l90-rj", videoIds: ["Et6Grrm1OLk"] },
        { title: "Sappy (1990 Studio Demo)", artist: "Nirvana", coverLink: "https://lh3.googleusercontent.com/aUSTL4p5gGFiKesMYQnYLqqQ8534TVY9A0A-4IbrZgGBVDKAmLbHsO2VFBYAhXDyDHa0hh2Ozs9FgyPF9A=w544-h544-s-l90-rj", videoIds: ["1MjAZSEprQU"] },
        { title: "Millennium", artist: "Robbie Williams", coverLink: "https://lh3.googleusercontent.com/eXVDuIRMQKHl6uyR-nWf3yLDfSD5rWNPh0bUMu0OdCn6ZlyOdLen3HyrmJGtCTWnY04WUvivct4YVNI=w544-h544-l90-rj", videoIds: ["sGDzkz3rKV4"] },
        { title: "Heaven Can Wait", artist: "Michael Jackson", coverLink: "https://i.discogs.com/2RH0GWmw-gLbNTQ-GTImSYuLLZvJOFA2AkJu8A7mylc/rs:fit/g:sm/q:90/h:592/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM0NTM2/MTEtMTQ0MDYwODM5/My02MDA5LmpwZWc.jpeg", videoIds: ["8Gl9h5FZdxk"] },
        { title: "Kid Who Stays in the Picture", artist: "Hot Hot Heat", coverLink: "https://lh3.googleusercontent.com/0mSHh8MlTKSq1LfjThZa4DRqGtLXCNetxH_lFlbPPOUlcoKRysPW_kb1YicROxpes3uNTu0ZYegCMMut=w544-h544-l90-rj", videoIds: ["xyBCenRonTc", "fOn3WjSIcMY"] },
        { title: "Traveling at the Speed of Light", artist: "Joywave", coverLink: "https://lh3.googleusercontent.com/1Yqi0xIJndmpKyyQfkhswNMuFaVjENQr_yMj0uR6oi-LA-iQX-DrS5sPBJ02b6qUUHhESfmjaExLLF4k=w544-h544-l90-rj", videoIds: ["yZAj7LZh8fs"] },
        { title: "Numb", artist: "Linkin Park", coverLink: "https://lh3.googleusercontent.com/Rqh2HDAD-Fj1-oHYqVklPGklMHIV3r6SMPMZmFE3FlLiWeBBnP3SCESfgeNdzQ-DmpCIvOGE4J0hzVxa=w544-h544-s-l90-rj", videoIds: ["dxp9w9Ggehc"] },
        { title: "I Might Be Wrong", artist: "Radiohead", coverLink: "https://lh3.googleusercontent.com/IztVMgq0rRLUhtQa6IxD4Vx145SQYQjnUQtuSHUl12b4B6Oyf-e-M0S1lrtIBnXCQFSeNABeanlxcdk=w544-h544-l90-rj", videoIds: ["_Qvlh_dvmkk"] },
        { title: "Sin", artist: "Nine Inch Nails", coverLink: "https://lh3.googleusercontent.com/lgi0zaHlbZC6stXi73LlAKkN-sdNTYSGJ0h4TNrG35TGTCOc7i47C4BDaXH7KboZWvKfGaLLPJ2tv50Y=w544-h544-l90-rj", videoIds: ["lIvzTlAdcUE"] },
        { title: "Looking For Strange", artist: "KMFDM", coverLink: "https://lh3.googleusercontent.com/JaQfxrFps-mW0HeyZRuzNE2sTJopn9jpEvrL-72swg2_n59ecYNwKH_tU-tIg3jEVYhmAFsDdHoVz57-iA=w544-h544-l90-rj", videoIds: ["Y1dGwI8uiwc"] },
        { title: "Red Flags And Long Nights", artist: "She Wants Revenge", coverLink: "https://lh3.googleusercontent.com/N-J6DkwVQ_5QP4f4eyeC-2RXVwB1DvO3FUkLVFGioq46LVGFRuzgQBijjp8TKtfIG-a_q-8sTftUt-s=w544-h544-s-l90-rj", videoIds: ["ENZy7f_v6Fs"] },
        { title: "Sub-culture", artist: "New Order", coverLink: "https://lh3.googleusercontent.com/D9wKilSquMzsqc9qdyw4Gu1rtJPvZ82WqvlJHu1dkOb0R2ncLduK2SLOCuGCH4qjJohVAvogj2-G9Zw=w544-h544-l90-rj", videoIds: ["Exoyet7OoWA"] },
        { title: "Where the Streets Have No Name (I Can’t Take My Eyes off You)", artist: "Pet Shop Boys", coverLink: "https://i.discogs.com/LFHv3FkAHQlhLo--6e5kUcHJMFpSAUnlYPh_6PXrxGs/rs:fit/g:sm/q:90/h:600/w:595/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIyODQ3/MTktMTM4NzU4OTY0/MS0zNDUwLmpwZWc.jpeg", videoIds: ["sm36_lWAviQ"] },
        { title: "I Ran (So Far Away)", artist: "A Flock Of Seagulls", coverLink: "https://lh3.googleusercontent.com/1T7FD-g00b1ioKn7-L12x9o8cracdGJ5s2mWhlTqbXQMwF0v-9E9BucDCY6Vnr4g0aQA2wdUOuKFsXan=w544-h544-l90-rj", videoIds: ["8UqlM0ki0Cc"] },
        { title: "Blessed State", artist: "The Wire", coverLink: "https://lh3.googleusercontent.com/Neurxtu-LF58Br8vc2I-VHFnPLKW8JqhZpW9Hdq11diLALnwTTMJ1-qQ03-kRcAtxa_31Ymu5JJG5ps=w544-h544-l90-rj", videoIds: ["LeCI9kww3Dk"] },
        { title: "Sleep Apnea", artist: "Beach Fossils", coverLink: "https://a2.cdn.hhv.de/items/images/generated/475x475/01054/1054978/1-beach-fossils-clash-the-truth-demos-colored-vinyl-edition.webp", videoIds: ["nuvJSl24wAw"] },
        { title: "Dream a Little Dream of Me", artist: "Michael Bublé", coverLink: "https://lh3.googleusercontent.com/57IJIYVLm6YTr9a1Wly4WGffKj3kn3s-5JFxCJ7LkRPWT5hLVrV21LDaT0I-7l6-djgF7-71zWvQZcc=w544-h544-l90-rj", videoIds: ["0QgM7lNgFnA"] },
        { title: "Humiliation", artist: "Yoñlu", coverLink: "https://lh3.googleusercontent.com/fecmzZxLj4SvYNp-6e5TrbLoWFqkIsmnJz0Z41CmHFClnoCHCBE3Wpn4Obg0aubsCzomD01OWASsPK-inw=w544-h544-l90-rj", videoIds: ["uQH85xHXnYQ", "6o1iNoUZdwI", "kQJSehvmen0"] },
    ];
    const PLAYLIST_THREE_DATA = [
        { title: "Someday Is Tonight", artist: "Janet Jackson", coverLink: "https://lh3.googleusercontent.com/LjZePM9GvoVF88nE4UKJvpH71-yXHGKsGnmt77imOV6bth_6E3pAlnQizYYDgX1Fl9j7k6vzHw0OPTkP=w544-h544-l90-rj", videoIds: ["jHoP9UACqaQ", "PEFLGA6zFaQ"] },
        { title: "Absolutely Nothing’s Changed", artist: "Tina Turner", coverLink: "https://lh3.googleusercontent.com/dWc6ruKtj-SAHS6qm_pa10SqLkjjZ_sRhzXjyS2SwFtooy2wdIf4nQ0XkclbU5XgIlf6qV58R13maUA=w544-h544-l90-rj", videoIds: ["lq1jdjxObrk"] },
        { title: "Low", artist: "Lenny Kravitz", coverLink: "https://lh3.googleusercontent.com/-QE8g4sUkiTgVXV8LYJ4VqwlcDL49GUyrzOu63cf5sRmIhq0mdAweVQ7EmMCGPGmi4CszL08UvIgrzKZ=w544-h544-l90-rj", videoIds: ["_zghpPDQ2y8"] },
        { title: "Marilyn Monroe", artist: "Pharrell Williams", coverLink: "https://lh3.googleusercontent.com/n1BU7liMVsgA5dZnk020PEoWyjjZECDqYR26DbV8osH6wJB2OPbw_8H13O-x7AwEK-4i_LJeHHQM6BFi=w544-h544-s-l90-rj", videoIds: ["xUPiYEhs3lw"] },
        { title: "Valentine’s Day", artist: "David Bowie", coverLink: "https://lh3.googleusercontent.com/dpM4jPTAa84rJ0hkkp3nPdn2lNdPmWXa1isLJu2A8HQXOBfMLmb3lJXH0c0UYj_c0DPBxen6TmOpH_U=w544-h544-l90-rj", videoIds: ["nbSdOIZhD5Y"] },
        { title: "Marquee Moon", artist: "Television", coverLink: "https://lh3.googleusercontent.com/lRzsgg9OZ8asdYhy47O0xix5umxrJJh6g3cbqGKmeWdz1jzZiUoH0fC0SDNzcBrIKNZqdr6SC3v1xz9K=w544-h544-s-l90-rj", videoIds: ["g4myghLPLZc"] },
        { title: "Me, I Disconnect from You", artist: "Tubeway Army", coverLink: "https://lh3.googleusercontent.com/0XD-Nt5289-YT_mp6YzVWUOH1kZ-BW9d-utBv4VCxjoyEgYZ2TVZIloROXYHH7Q4THNmddM9Of77MLoTTQ=w544-h544-l90-rj", videoIds: ["6SCrfZPMeWg"] },
        { title: "Darkness", artist: "The Human League", coverLink: "https://lh3.googleusercontent.com/5UgvTLEebZkbRH9fiGuJajPDSur-nJXHpHKCJUDkQd3LR-hJBAsqeKevMhPKQnyNX7MbBRnQWWabh0u0=w544-h544-l90-rj", videoIds: ["vPfk7ktdqo4"] },
        { title: "Fall Into Place", artist: "Apartment", coverLink: "https://lh3.googleusercontent.com/G5iK-2BALHx_hHwB1LBmzHthvtt3BF8NB428Ub4sTkTYUv3bT6bI6lN9N1SZyIlzKTps58GudSFHWPXo=w544-h544-l90-rj", videoIds: ["IQaEg6GguLk"] },
        { title: "Fight Song", artist: "Rachel Platten", coverLink: "https://lh3.googleusercontent.com/AxQrFKHbt5jU_DiZihMhlJ3bxGLBy3rN6yfLlb0SJ68ay4FpnciNHNkD9WTXPBfbX1gCCZI5pFs2bJzU=w544-h544-l90-rj", videoIds: ["y5h_dukaB1I"] },
        { title: "The Ballad of Harambe", artist: "c a n d i d !", coverLink: "https://lh3.googleusercontent.com/F3ub3Ot4uC_HiLYe9RW-nxvMI__N7S5OkyGf_4bgU1MSIW4wp05es_6DF2GBAueUM-LVzIqxz8YuI1rY=w544-h544-l90-rj", videoIds: ["VX8omFoNHdQ"] },
        { title: "Set Adrift on Memory Bliss", artist: "P.M. Dawn", coverLink: "https://lh3.googleusercontent.com/51qmaba8irr1qqXAcVc5CGV6bTiNNlevjEgh4cCDCntbqZP4dc1gcVlcf_lxA42D8CkZxDTW3L3SnPa4=w544-h544-l90-rj", videoIds: ["MurZoAE40VA"] },
        { title: "Woke Up This Morning (Chosen One Mix)", artist: "Alabama 3", coverLink: "https://lh3.googleusercontent.com/EHKdWSYR9Kenl61Gu87krAIFBJCRmrHdTGISW46gHmiAjuElSW18fCpkvVTlGYnKn3lzmartBT_7K3t6mQ=w544-h544-l90-rj", videoIds: ["slpCmg53qkU", "EvCdCKyLo_I", "6_0nDHcrrtE"] },
        { title: "What’s on Your Mind (Pure Energy)", artist: "Information Society", coverLink: "https://lh3.googleusercontent.com/ZWMW9K6oQVxTOOfPAy-7NLsta-kxbLXWEWgG7o4ZuO8c25KMs07dkGc-lHY0Udg9J9jdsSVsYJTgjq8=w544-h544-l90-rj", videoIds: ["lCrD81j6OD0"] },
        { title: "Dirty Dreamer (XXX)", artist: "Hot Flash Heat Wave", coverLink: "https://lh3.googleusercontent.com/1hBYdeKS2xmwKgfhmRTqN18V0fMgu4PBc_Rg2UkcQY2W8KnFe5Csu2cQE4h8LAgNn21XGERhJXvnVH97=w544-h544-l90-rj", videoIds: ["Xyo5SKE5mpU"] },
        { title: "Bad Habit", artist: "The Kooks", coverLink: "https://i.scdn.co/image/ab67616d0000b273c8fcda98c93a02df95dec4ae", videoIds: ["VYfv5qcX5vo", "3tUh-x-fp8Q"] },
        { title: "Good Clean Fun", artist: "Kaiser Chiefs", coverLink: "https://lh3.googleusercontent.com/1WYR7vOnMx8sbUbBHEI-3Q8YFfQOqvtTovFZnsUvcLnVGR2nmLegDLguykg8kgKiQi6OL6ZLNhag1_NY=w544-h544-l90-rj", videoIds: ["zcMX8fQ7buU"] },
        { title: "Stop The World I Wanna Get Off With You", artist: "Arctic Monkeys", coverLink: "https://lh3.googleusercontent.com/D2kk6n8VH8YTwZoY9Vczdmrm74WvvkWgiCgIVVLcMv-NXyzZFgL-J64Mwls0p9P7x1aqM1xovqry5JM=w544-h544-l90-rj", videoIds: ["H8oiojAmKCI"] },
        { title: "Saving All My Love For You", artist: "Whitney Houston", coverLink: "https://lh3.googleusercontent.com/qRoa7SdWC7qa13JLpgK5wrqJc7HsJAGfDlRzyJPBpiF8zY8sgQ4YSocEqlwRZpM8_JtJcWxaKAb2d_kerQ=w544-h544-l90-rj", videoIds: ["GpQbMAIZVn8"] },
    ];
    let PLAYLISTS_DATA = [];

    // constants
    const PLAYER_ELEMENT_ID = "nice-music-player";
    const PLAYER_MAIN_CONTENT_WRAPPER_ID = "player-main-content-wrapper";
    const PLAYER_RIGHT_PANEL_ID = "player-right-panel";
    const PLAYLIST_SELECTOR_CONTAINER_ID = "player-playlist-selector-container";
    const PLAYLIST_SELECTOR_ID = "player-playlist-selector";
    const YOUTUBE_PLAYER_DIV_ID = "youtube-player-container";
    const DISPLAY_BOX_ID = "player-display-box";
    const COVER_ID = "player-cover";
    const INFO_CONTAINER_ID = "player-info-container";
    const SONG_INFO_ID = "player-song-info";
    const TITLE_LINE_WRAPPER_CLASS = "player-title-line-wrapper";
    const TITLE_ID = "player-title";
    const ARTIST_ID = "player-artist";
    const YOUTUBE_LINK_ID = "player-youtube-link";
    const CONTROLS_CONTAINER_ID = "player-controls-container";
    const CONTROLS_ID = "player-controls";
    const PREV_BUTTON_ID = "player-prev-button";
    const PLAY_PAUSE_BUTTON_ID = "player-play-pause-button";
    const NEXT_BUTTON_ID = "player-next-button";
    const PROGRESS_BAR_CONTAINER_ID = "player-progress-bar-container";
    const CURRENT_TIME_ID = "player-current-time";
    const PROGRESS_BAR_ID = "player-progress-bar";
    const DURATION_ID = "player-duration";
    const VOLUME_CONTAINER_ID = "player-volume-container";
    const VOLUME_ICON_ID = "player-volume-icon";
    const VOLUME_PERCENTAGE_ID = "player-volume-percentage";
    const VOLUME_SLIDER_ID = "player-volume-slider";
    const REPEAT_BUTTON_ID = "player-repeat-button";
    const SHUFFLE_BUTTON_ID = "player-shuffle-button";
    const PLAYER_CONTROL_BUTTON_CLASS = 'player-control-button';
    const QUEUE_CONTAINER_ID = "player-queue-container";
    const QUEUE_TITLE_ID = "player-queue-title";
    const QUEUE_LIST_ID = "player-queue-list";
    const PLAYER_QUEUE_ITEM_CLASS = "player-queue-item";
    const QUEUE_TOGGLE_ICON_ID = "player-queue-toggle-icon";

    // icons
    const ICON_PLAY = "https://upload.wikimedia.org/wikipedia/commons/9/96/Crystal_Project_Player_play.png";
    const ICON_PAUSE = "https://upload.wikimedia.org/wikipedia/commons/d/dd/Crystal_Project_Player_pause.png";
    const ICON_PREV = "https://upload.wikimedia.org/wikipedia/commons/e/ef/Crystal_Project_Player_rew.png";
    const ICON_NEXT = "https://upload.wikimedia.org/wikipedia/commons/6/66/Crystal_Project_Player-end.png";
    const ICON_VOLUME = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%23424242'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E";
    const ICON_MUTED = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%23424242'%3E%3Cpath d='M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'/%3E%3C/svg%3E";
    const ICON_YOUTUBE = "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_play_button_icon_%282013%E2%80%932017%29.svg";
    const ICON_REPEAT_NONE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%23424242'%3E%3Cpath d='M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z'/%3E%3C/svg%3E";
    const ICON_REPEAT_ALL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%233F51B5'%3E%3Cpath d='M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z'/%3E%3C/svg%3E";
    const ICON_REPEAT_ONE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%233F51B5'%3E%3Cpath d='M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z'/%3E%3Cpath d='M13 15V9h-1l-2 1v1h1.5v4z'/%3E%3C/svg%3E";
    const ICON_SHUFFLE_OFF = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' viewBox='0 0 24 24' fill='%23424242'%3E%3Cpath d='M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm0.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z'/%3E%3C/svg%3E";
    const ICON_SHUFFLE_ON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' viewBox='0 0 24 24' fill='%233F51B5'%3E%3Cpath d='M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm0.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z'/%3E%3C/svg%3E";

    class Song {
        constructor(title, artist, coverLink, videoIds) {
            this.title = title;
            this.artist = artist;
            this.coverLink = coverLink;
            this.videoIds = Array.isArray(videoIds) ? videoIds : [videoIds];
            this.currentVideoIndex = 0; // to track which video to try
        }
        getTitle() { return this.title; }
        getArtist() { return this.artist; }
        getCoverLink() { return this.coverLink; }

        // gets the video ID for the current attempt
        getCurrentVideoId() {
            return this.videoIds && this.videoIds.length > 0 ? this.videoIds[this.currentVideoIndex] : null;
        }

        // gets the YouTube link for the video that is currently being attempted
        getYoutubeLink() {
            const videoId = this.getCurrentVideoId();
            return videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#';
        }

        // tries to switch to the next available video ID
        // returns true if there is a next video, false otherwise
        tryNextVideo() {
            if (this.currentVideoIndex < this.videoIds.length - 1) {
                this.currentVideoIndex++;
                return true;
            }
            return false;
        }

        // resets the video index to the primary one (the first in the array)
        resetVideoIndex() {
            this.currentVideoIndex = 0;
        }
    }
    class Playlist {
        constructor(songs = []) { this.songs = songs; this.currentSongIndex = 0; }
        addSong(song) { this.songs.push(song); }
        getCurrentSong() { return this.songs.length > 0 ? this.songs[this.currentSongIndex] : null; }
        playNext() { if (this.songs.length > 0) this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length; }
        playPrevious() { if (this.songs.length > 0) this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length; }
        setCurrentSongIndex(index) { if (index >= 0 && index < this.songs.length) this.currentSongIndex = index; else console.warn(`Invalid song index: ${index}`); }
        isEmpty() { return this.songs.length === 0; }
        getSongs() { return this.songs; }
        setSongs(newSongs) { this.songs = newSongs; }
    }

    let playlist;
    let activePlaylistIndex = 0;
    let originalSongOrderForCurrentPlaylist = [];
    let isShuffleActive = false;
    let ytPlayer;
    let playerReady = false;
    let isSeeking = false;
    let rafId = null;
    let isUpdaterRunning = false;
    let volumeBeforeMute = 0.5;
    let repeatMode = 'none';

    let hasUserInitiatedPlayback = true; // prevents initial autoplay
    let isQueueSectionExpanded = true; // for collapsible queue

    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastRafUpdateTime = 0;
    let playerShouldBeUpdatingWhenVisible = false;
    const MAX_QUEUE_ITEMS_DISPLAYED = 5;

    let playerContainer, mainContentWrapper, playlistSelectorContainer, playlistSelectorElement;
    let coverElement, titleElement, artistElement, youtubeLinkElement;
    let playPauseButton, prevButtonElement, nextButtonElement, progressBar, currentTimeElement, durationElement;
    let volumeContainer, volumeIconElement, volumePercentageElement, volumeSlider;
    let repeatButtonElement, shuffleButtonElement;
    let queueContainerElement, queueTitleElement, queueListElement;

    function formatTime(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds < 0) { return "--:--"; }
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        const newArray = [...array];
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
        }
        return newArray;
    }

    function updateUI() {
        const currentSong = playlist?.getCurrentSong();
        if (!coverElement || !titleElement || !artistElement || !youtubeLinkElement) {
            return;
        }

        if (!currentSong) {
            coverElement.src = ""; coverElement.alt = "No cover art";
            titleElement.textContent = "No song loaded"; titleElement.title = "";
            artistElement.textContent = ""; artistElement.title = "";
            youtubeLinkElement.href = "#"; youtubeLinkElement.classList.add('hidden');
            if (playPauseButton) updatePlayPauseButton(true);
            if (progressBar) { progressBar.value = 0; progressBar.style.setProperty('--progress-percent', '0%'); }
            if (currentTimeElement) currentTimeElement.textContent = "0:00";
            if (durationElement) durationElement.textContent = "--:--";
        } else {
            coverElement.src = currentSong.getCoverLink(); coverElement.alt = `Cover art for ${currentSong.getTitle()}`;
            const songTitle = currentSong.getTitle();
            titleElement.textContent = songTitle; titleElement.title = songTitle;
            const songArtist = currentSong.getArtist();
            artistElement.textContent = songArtist; artistElement.title = songArtist;
            youtubeLinkElement.href = currentSong.getYoutubeLink(); youtubeLinkElement.classList.remove('hidden');
        }

        if (playerReady && ytPlayer && typeof ytPlayer.getPlayerState === 'function' && hasUserInitiatedPlayback) {
            const state = ytPlayer.getPlayerState();
            if (playPauseButton) updatePlayPauseButton(state !== YT.PlayerState.PLAYING && state !== YT.PlayerState.BUFFERING);
            updateDurationDisplay();
        } else {
            if (playPauseButton) updatePlayPauseButton(true);
            if (durationElement) durationElement.textContent = "--:--";
        }
        updateVolumeIcon();
        if (repeatButtonElement) updateRepeatButtonUI();
        if (shuffleButtonElement) updateShuffleButtonUI();
        if (playlistSelectorElement) playlistSelectorElement.value = activePlaylistIndex.toString();
        updateQueueDisplay();
    }

    function updateDurationDisplay() {
        if (!durationElement) return;
        if (!playerReady || !ytPlayer || typeof ytPlayer.getDuration !== 'function' || !hasUserInitiatedPlayback) {
            durationElement.textContent = "--:--";
            return;
        }
        const duration = ytPlayer.getDuration();
        durationElement.textContent = formatTime(duration);
    }

    function loadCurrentSong(autoplay = false, isRetry = false) {
        console.debug(`loadCurrentSong called, autoplay=${autoplay}, isRetry=${isRetry}`);
        const currentSong = playlist?.getCurrentSong();

        // if this is a fresh attempt to play a song (not a retry from an error),
        // reset its video index to the primary one
        if (currentSong && !isRetry) {
            currentSong.resetVideoIndex();
        }

        updateUI();
        stopRafUpdater();
        if (progressBar) { progressBar.value = 0; progressBar.style.setProperty('--progress-percent', '0%'); }
        if (currentTimeElement) currentTimeElement.textContent = "0:00";
        if (durationElement) durationElement.textContent = "--:--";

        if (!playerReady || !ytPlayer || typeof ytPlayer.loadVideoById !== 'function') {
            console.warn("Player not ready or loadVideoById unavailable. Cannot load song.");
            if (playPauseButton) updatePlayPauseButton(true);
            return;
        }

        if (!currentSong) {
            console.warn("No current song to load.");
            if (typeof ytPlayer.stopVideo === 'function') ytPlayer.stopVideo();
            if (playPauseButton) updatePlayPauseButton(true);
            return;
        }

        const videoIdToLoad = currentSong.getCurrentVideoId();
        if (!videoIdToLoad) {
            console.error(`No video ID found for "${currentSong.getTitle()}". Skipping.`);
            onPlayerError({ data: 100 }); // simulate a "not found" error
            return;
        }

        console.log(`Loading video: ${videoIdToLoad} - ${currentSong.getTitle()}`);
        ytPlayer.loadVideoById({
            videoId: videoIdToLoad,
            startSeconds: 0,
            suggestedQuality: 'small'
        });
        window._musicPlayerAutoplayIntent = autoplay;
    }

    function loadNewPlaylistByIndex(newPlaylistIndex, autoplayOverride = null) {
        if (newPlaylistIndex < 0 || newPlaylistIndex >= PLAYLISTS_DATA.length) {
            console.warn(`Invalid playlist index: ${newPlaylistIndex}`);
            return;
        }
        activePlaylistIndex = newPlaylistIndex;
        const selectedPlaylistData = PLAYLISTS_DATA[activePlaylistIndex];

        if (playerReady && ytPlayer && typeof ytPlayer.stopVideo === 'function' && hasUserInitiatedPlayback) {
            ytPlayer.stopVideo();
        }
        stopRafUpdater();

        const newSongs = selectedPlaylistData.songs.map(d => new Song(d.title, d.artist, d.coverLink, d.videoIds || d.videoId));
        originalSongOrderForCurrentPlaylist = [...newSongs];

        if (isShuffleActive) {
            const currentSongVideoId = playlist?.getCurrentSong()?.getCurrentVideoId();
            const shuffledNewSongs = shuffleArray(newSongs);
            playlist = new Playlist(shuffledNewSongs);
            if (currentSongVideoId) {
                const newIdx = playlist.getSongs().findIndex(s => s.videoIds.includes(currentSongVideoId));
                if (newIdx !== -1) playlist.setCurrentSongIndex(newIdx);
                else playlist.setCurrentSongIndex(0);
            } else {
                playlist.setCurrentSongIndex(0);
            }
        } else {
            playlist = new Playlist(newSongs);
            playlist.setCurrentSongIndex(0);
        }

        if (!hasUserInitiatedPlayback) {
            updateUI();
            loadCurrentSong(false);
        } else {
            let shouldAutoplayThisLoad = autoplayOverride === null ? true : autoplayOverride;
            loadCurrentSong(shouldAutoplayThisLoad);
        }
    }

    function togglePlayPause() {
        if (!playerReady || !ytPlayer || typeof ytPlayer.getPlayerState !== 'function') {
            console.warn("Player not ready, cannot toggle play/pause.");
            return;
        }

        if (!hasUserInitiatedPlayback) {
            if (playlist.isEmpty()) {
                console.warn("Cannot play: Playlist is empty.");
                return;
            }
            hasUserInitiatedPlayback = true;
            loadCurrentSong(true); // load the current (first) song and play it
        } else {
            const state = ytPlayer.getPlayerState();
            if (state === YT.PlayerState.PLAYING) {
                console.debug("Pausing video.");
                ytPlayer.pauseVideo();
            } else { // PAUSED, ENDED, CUED, UNSTARTED
                console.debug("Playing video.");
                if (playlist.isEmpty() && PLAYLISTS_DATA.length > 0 && PLAYLISTS_DATA[activePlaylistIndex].songs.length > 0) {
                    loadCurrentSong(true);
                } else if (!playlist.isEmpty()) {
                    if (state === YT.PlayerState.ENDED && repeatMode !== 'one') {
                        playlist.playNext();
                        loadCurrentSong(true);
                    } else {
                        ytPlayer.playVideo();
                    }
                } else {
                    console.warn("Cannot play: No songs in current playlist or no playlists available.");
                }
            }
        }
    }

    function updatePlayPauseButton(isPaused) {
        if (!playPauseButton) return;
        const img = playPauseButton.querySelector('img');
        const label = isPaused ? "Play" : "Pause";
        if (img) {
            img.src = isPaused ? ICON_PLAY : ICON_PAUSE;
            img.alt = "";
        }
        playPauseButton.setAttribute('aria-label', label);
        playPauseButton.title = label;
    }
    function rafUpdateProgress(timestamp) {
        if (!isUpdaterRunning) return;
        if (!playerReady || !ytPlayer || typeof ytPlayer.getCurrentTime !== 'function' || typeof ytPlayer.getDuration !== 'function' || !hasUserInitiatedPlayback) {
            stopRafUpdater(); return;
        }
        if (isSeeking) { rafId = requestAnimationFrame(rafUpdateProgress); return; }

        if (timestamp - lastRafUpdateTime >= FRAME_INTERVAL) {
            lastRafUpdateTime = timestamp;
            const currentTime = ytPlayer.getCurrentTime();
            const duration = ytPlayer.getDuration();
            if (duration && isFinite(duration) && duration > 0) {
                const progress = (currentTime / duration) * 100;
                if (progressBar) { progressBar.value = progress; progressBar.style.setProperty('--progress-percent', `${progress}%`); }
                if (currentTimeElement) currentTimeElement.textContent = formatTime(currentTime);
                if (durationElement && durationElement.textContent === "--:--") updateDurationDisplay();
            } else {
                if (progressBar) { progressBar.value = 0; progressBar.style.setProperty('--progress-percent', '0%'); }
                if (currentTimeElement) currentTimeElement.textContent = "0:00";
                if (durationElement) updateDurationDisplay();
            }
        }
        if (isUpdaterRunning) rafId = requestAnimationFrame(rafUpdateProgress);
        else { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
    }
    function startRafUpdater() {
        if (isUpdaterRunning) return;
        if (!playerReady || !ytPlayer || typeof ytPlayer.getPlayerState !== 'function' || ytPlayer.getPlayerState() !== YT.PlayerState.PLAYING || !hasUserInitiatedPlayback) {
            return;
        }
        if (document.visibilityState === 'hidden') {
            playerShouldBeUpdatingWhenVisible = true; return;
        }
        isUpdaterRunning = true; lastRafUpdateTime = 0;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(rafUpdateProgress);
    }
    function stopRafUpdater() {
        if (!isUpdaterRunning && !rafId) return;
        isUpdaterRunning = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }
    function handleVisibilityChange() {
        if (!playerReady || !ytPlayer || typeof ytPlayer.getPlayerState !== 'function' || !hasUserInitiatedPlayback) return;
        if (document.visibilityState === 'hidden') {
            if (isUpdaterRunning) { stopRafUpdater(); playerShouldBeUpdatingWhenVisible = true; }
            else if (ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) { playerShouldBeUpdatingWhenVisible = true; }
        } else if (document.visibilityState === 'visible') {
            if (playerShouldBeUpdatingWhenVisible) {
                playerShouldBeUpdatingWhenVisible = false;
                if (ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) startRafUpdater();
            } else if (!isUpdaterRunning && ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
                startRafUpdater();
            }
        }
    }

    function onPlayerReady(event) {
        console.log("YouTube player ready!");
        playerReady = true;
        setVolumeFromSlider(false);

        updateUI();
        updateVolumeIcon();

        if (hasUserInitiatedPlayback && playlist && !playlist.isEmpty()) {
            console.log("Attempting to autoplay first song...");
            loadCurrentSong(true);
        }

        if (document.visibilityState === 'visible' && ytPlayer.getPlayerState() === YT.PlayerState.PLAYING && hasUserInitiatedPlayback) {
            startRafUpdater();
        } else if (document.visibilityState === 'hidden' && ytPlayer.getPlayerState() === YT.PlayerState.PLAYING && hasUserInitiatedPlayback) {
            playerShouldBeUpdatingWhenVisible = true;
        }
    }

    function onPlayerStateChange(event) {
        const state = event.data;
        const stateName = Object.keys(YT.PlayerState).find(key => YT.PlayerState[key] === state) || 'UNKNOWN';
        //console.log(`Player state changed: ${state} (${stateName})`);

        if (state !== YT.PlayerState.UNSTARTED && state !== -1) {
        }

        updateDurationDisplay();

        switch (state) {
            case YT.PlayerState.PLAYING:
                if (playPauseButton) updatePlayPauseButton(false);
                startRafUpdater();
                updateUI();
                break;
            case YT.PlayerState.PAUSED:
                if (playPauseButton) updatePlayPauseButton(true);
                stopRafUpdater();
                break;
            case YT.PlayerState.ENDED:
                stopRafUpdater();
                if (playPauseButton) updatePlayPauseButton(true);
                if (progressBar) { progressBar.value = 100; progressBar.style.setProperty('--progress-percent', '100%'); }
                if (currentTimeElement && ytPlayer && typeof ytPlayer.getDuration === 'function') {
                    currentTimeElement.textContent = formatTime(ytPlayer.getDuration());
                }

                if (!hasUserInitiatedPlayback) {
                    updateUI();
                    return;
                }

                if (repeatMode === 'one') {
                    ytPlayer.seekTo(0, true);
                    ytPlayer.playVideo();
                } else {
                    const previousSongIndex = playlist.currentSongIndex;
                    playlist.playNext();

                    const isLastSongAndNotRepeatingAll = playlist.currentSongIndex === 0 &&
                        previousSongIndex === playlist.getSongs().length - 1 &&
                        repeatMode !== 'all';

                    let shouldAutoplay;
                    if (isLastSongAndNotRepeatingAll) {
                        shouldAutoplay = false;
                    } else {
                        shouldAutoplay = true;
                    }
                    loadCurrentSong(shouldAutoplay);
                }
                break;
            case YT.PlayerState.BUFFERING:
                if (playPauseButton) updatePlayPauseButton(false);
                break;
            case YT.PlayerState.CUED:
                if (playPauseButton) updatePlayPauseButton(true);
                stopRafUpdater();
                if (progressBar) { progressBar.value = 0; progressBar.style.setProperty('--progress-percent', '0%'); }
                if (currentTimeElement) currentTimeElement.textContent = "0:00";
                updateUI();
                updateDurationDisplay();

                if (window._musicPlayerAutoplayIntent === true) {
                    ytPlayer.playVideo();
                }
                break;
            case YT.PlayerState.UNSTARTED:
                if (playPauseButton) updatePlayPauseButton(true);
                stopRafUpdater();
                if (currentTimeElement) currentTimeElement.textContent = "0:00";
                if (durationElement) durationElement.textContent = "--:--";
                updateUI();
                break;
            default: break;
        }
    }
    function onPlayerError(event) {
        const recoverableErrorCodes = [2, 5, 100, 101, 150];
        const errorCodes = { 2: 'Invalid parameter.', 5: 'HTML5 error.', 100: 'Not found/private.', 101: 'Embedding disallowed.', 150: 'Embedding disallowed.' };
        const errorMsg = errorCodes[event.data] || `Unknown error (${event.data})`;
        console.error(`YouTube Player Error: ${errorMsg}`);

        const currentSong = playlist?.getCurrentSong();

        // if the error is recoverable (e.g., video blocked), try the next available video ID
        if (currentSong && recoverableErrorCodes.includes(event.data)) {
            console.log(`Video failed for "${currentSong.getTitle()}". Checking for alternatives...`);
            if (currentSong.tryNextVideo()) {
                console.log(`Found an alternative. Attempting to play video ID: ${currentSong.getCurrentVideoId()}`);
                // reload the song with the next video ID. isRetry=true prevents resetting the video index
                loadCurrentSong(window._musicPlayerAutoplayIntent, true);
                return; // stop further error processing for this event
            } else {
                console.warn(`No more alternative videos for "${currentSong.getTitle()}".`);
            }
        }

        // handle final/unrecoverable errors
        if (playPauseButton) updatePlayPauseButton(true);
        stopRafUpdater();
        if (titleElement) titleElement.textContent = "Error";
        if (artistElement) artistElement.textContent = errorMsg;
    }
    function setVolumeFromSlider(shouldUnmute = true) {
        if (!volumeSlider || !volumePercentageElement) return;
        const volumeValue = parseFloat(volumeSlider.value);
        const newVolumePercent = Math.round(volumeValue * 100);

        if (playerReady && ytPlayer && typeof ytPlayer.setVolume === 'function') {
            ytPlayer.setVolume(newVolumePercent);
            if (shouldUnmute && newVolumePercent > 0 && typeof ytPlayer.isMuted === 'function' && ytPlayer.isMuted()) {
                ytPlayer.unMute();
            }
            if (newVolumePercent === 0 && typeof ytPlayer.mute === 'function' && !ytPlayer.isMuted()) {
                ytPlayer.mute();
            }
        }

        volumePercentageElement.textContent = `${newVolumePercent}%`;
    }
    function toggleMute() {
        if (!playerReady || !ytPlayer || !volumeSlider || !volumeIconElement) return;

        const isCurrentlyMuted = ytPlayer.isMuted();

        if (isCurrentlyMuted) {
            ytPlayer.unMute();
            const restoreVolume = (volumeBeforeMute > 0) ? volumeBeforeMute : 0.5;
            ytPlayer.setVolume(restoreVolume * 100);
            volumeSlider.value = restoreVolume;
            if (volumePercentageElement) {
                volumePercentageElement.textContent = `${Math.round(restoreVolume * 100)}%`;
            }
            volumeIconElement.src = ICON_VOLUME;
            volumeIconElement.alt = "Mute";
            volumeIconElement.title = "Mute";

        } else {
            const currentSliderValue = parseFloat(volumeSlider.value);
            if (currentSliderValue > 0) {
                volumeBeforeMute = currentSliderValue;
            }

            ytPlayer.mute();
            volumeSlider.value = 0;
            if (volumePercentageElement) {
                volumePercentageElement.textContent = `0%`;
            }

            volumeIconElement.src = ICON_MUTED;
            volumeIconElement.alt = "Unmute";
            volumeIconElement.title = "Unmute";
        }
    }
    function updateVolumeIcon() {
        if (!volumeIconElement || !volumeSlider) return;

        const sliderValue = parseFloat(volumeSlider.value);
        const isMutedBySlider = sliderValue === 0;

        let isMutedByPlayer = false;
        if (playerReady && ytPlayer && typeof ytPlayer.isMuted === 'function') {
            isMutedByPlayer = ytPlayer.isMuted();
        }

        const isEffectivelyMuted = isMutedBySlider || isMutedByPlayer;

        volumeIconElement.src = isEffectivelyMuted ? ICON_MUTED : ICON_VOLUME;
        volumeIconElement.alt = isEffectivelyMuted ? "Unmute" : "Mute";
        volumeIconElement.title = isEffectivelyMuted ? "Unmute" : "Mute";
    }
    function toggleRepeatMode() {
        switch (repeatMode) {
            case 'none': repeatMode = 'all'; break;
            case 'all': repeatMode = 'one'; break;
            case 'one': repeatMode = 'none'; break;
            default: repeatMode = 'none';
        }
        updateRepeatButtonUI();
        updateQueueDisplay();
    }
    function updateRepeatButtonUI() {
        if (!repeatButtonElement) return;
        const img = repeatButtonElement.querySelector('img');
        let iconSrc = ICON_REPEAT_NONE; let label = "Repeat Off";
        repeatButtonElement.classList.remove('repeat-active', 'repeat-one');
        if (repeatMode === 'all') { iconSrc = ICON_REPEAT_ALL; label = "Repeat All"; repeatButtonElement.classList.add('repeat-active'); }
        else if (repeatMode === 'one') { iconSrc = ICON_REPEAT_ONE; label = "Repeat One"; repeatButtonElement.classList.add('repeat-active', 'repeat-one'); }
        if (img) { img.src = iconSrc; img.alt = ""; }
        repeatButtonElement.setAttribute('aria-label', label); repeatButtonElement.title = label;
    }
    function toggleShuffleMode() {
        if (!playlist || playlist.isEmpty()) return;

        isShuffleActive = !isShuffleActive;
        const currentSongBeforeToggle = playlist.getCurrentSong();

        if (isShuffleActive) {
            const shuffledSongs = shuffleArray(originalSongOrderForCurrentPlaylist);
            playlist.setSongs(shuffledSongs);
        } else {
            playlist.setSongs([...originalSongOrderForCurrentPlaylist]);
        }

        if (currentSongBeforeToggle) {
            const newIndex = playlist.getSongs().findIndex(song => song.getCurrentVideoId() === currentSongBeforeToggle.getCurrentVideoId());
            playlist.setCurrentSongIndex(newIndex !== -1 ? newIndex : 0);
        } else {
            playlist.setCurrentSongIndex(0);
        }

        updateShuffleButtonUI();
        updateQueueDisplay();
        updateUI();
    }
    function updateShuffleButtonUI() {
        if (!shuffleButtonElement) return;
        const img = shuffleButtonElement.querySelector('img');
        let iconSrc = isShuffleActive ? ICON_SHUFFLE_ON : ICON_SHUFFLE_OFF;
        let label = isShuffleActive ? "Shuffle On" : "Shuffle Off";
        shuffleButtonElement.classList.toggle('shuffle-active', isShuffleActive);
        if (img) { img.src = iconSrc; img.alt = ""; }
        shuffleButtonElement.setAttribute('aria-label', label); shuffleButtonElement.title = label;
    }

    function updateQueueDisplay() {
        if (!queueListElement || !playlist) {
            if (queueListElement) queueListElement.innerHTML = `<li class="${PLAYER_QUEUE_ITEM_CLASS} player-queue-empty">Queue is empty</li>`;
            if (queueTitleElement) queueTitleElement.style.display = (playlist && !playlist.isEmpty() && PLAYLISTS_DATA.length > 0) ? 'flex' : 'none'
            return;
        }
        if (queueTitleElement) queueTitleElement.style.display = 'flex';

        if (playlist.isEmpty()) {
            queueListElement.innerHTML = `<li class="${PLAYER_QUEUE_ITEM_CLASS} player-queue-empty">Queue is empty</li>`;
            return;
        }


        queueListElement.innerHTML = '';
        const songs = playlist.getSongs();
        const currentIndex = playlist.currentSongIndex;
        const numSongs = songs.length;

        if (numSongs <= 1) {
            queueListElement.innerHTML = `<li class="${PLAYER_QUEUE_ITEM_CLASS} player-queue-empty">No upcoming songs</li>`;
            return;
        }

        let songsShownCount = 0;
        for (let i = 1; i < numSongs && songsShownCount < MAX_QUEUE_ITEMS_DISPLAYED; i++) {
            let nextIndex = (currentIndex + i) % numSongs;
            if (repeatMode !== 'all' && !isShuffleActive && nextIndex < (currentIndex + i) && nextIndex < currentIndex) {
                break;
            }

            const song = songs[nextIndex];
            const li = document.createElement("li");
            li.className = PLAYER_QUEUE_ITEM_CLASS;
            li.dataset.songIndex = nextIndex;

            const titleSpan = document.createElement("span");
            titleSpan.className = "player-queue-item-title";
            titleSpan.textContent = song.getTitle();
            titleSpan.title = song.getTitle();

            const artistSpan = document.createElement("span");
            artistSpan.className = "player-queue-item-artist";
            artistSpan.textContent = ` - ${song.getArtist()}`;
            artistSpan.title = song.getArtist();

            li.appendChild(titleSpan);
            li.appendChild(artistSpan);

            li.addEventListener('click', () => {
                if (!hasUserInitiatedPlayback) {
                    hasUserInitiatedPlayback = true;
                }
                const songIndexToPlay = parseInt(li.dataset.songIndex, 10);
                playlist.setCurrentSongIndex(songIndexToPlay);
                loadCurrentSong(true);
            });
            queueListElement.appendChild(li);
            songsShownCount++;
        }

        if (songsShownCount === 0 && queueListElement.innerHTML === '') {
            queueListElement.innerHTML = `<li class="${PLAYER_QUEUE_ITEM_CLASS} player-queue-empty">End of playlist</li>`;
        }
    }

    function toggleQueueExpansion() {
        isQueueSectionExpanded = !isQueueSectionExpanded;
        const queueContainer = document.getElementById(QUEUE_CONTAINER_ID);
        const toggleIcon = document.getElementById(QUEUE_TOGGLE_ICON_ID);

        if (!queueContainer || !toggleIcon) return;

        if (isQueueSectionExpanded) {
            queueContainer.classList.remove('queue-collapsed');
            toggleIcon.innerHTML = "▼"; // down arrow ▼
        } else {
            queueContainer.classList.add('queue-collapsed');
            toggleIcon.innerHTML = "▶"; // right arrow ►
        }
    }

    function createPlayerElements() {
        const fragment = document.createDocumentFragment();
        playerContainer = document.createElement("div"); playerContainer.id = PLAYER_ELEMENT_ID; fragment.appendChild(playerContainer);

        const mainPlayerArea = document.createElement("div");
        mainPlayerArea.id = "player-main-area";
        playerContainer.appendChild(mainPlayerArea);

        mainContentWrapper = document.createElement("div"); mainContentWrapper.id = PLAYER_MAIN_CONTENT_WRAPPER_ID; mainPlayerArea.appendChild(mainContentWrapper);

        const displayBox = document.createElement("div"); displayBox.id = DISPLAY_BOX_ID;
        coverElement = document.createElement("img"); coverElement.id = COVER_ID; coverElement.alt = "Album cover"; coverElement.src = ""; displayBox.appendChild(coverElement);
        mainContentWrapper.appendChild(displayBox);

        const rightPanel = document.createElement("div");
        rightPanel.id = PLAYER_RIGHT_PANEL_ID;
        mainContentWrapper.appendChild(rightPanel);

        playlistSelectorContainer = document.createElement("div");
        playlistSelectorContainer.id = PLAYLIST_SELECTOR_CONTAINER_ID;
        const playlistLabel = document.createElement("label"); playlistLabel.htmlFor = PLAYLIST_SELECTOR_ID; playlistLabel.textContent = "Select playlist:"; playlistSelectorContainer.appendChild(playlistLabel);
        playlistSelectorElement = document.createElement("select"); playlistSelectorElement.id = PLAYLIST_SELECTOR_ID; playlistSelectorElement.title = "Select playlist"; playlistSelectorContainer.appendChild(playlistSelectorElement);
        rightPanel.appendChild(playlistSelectorContainer);

        const infoContainer = document.createElement("div"); infoContainer.id = INFO_CONTAINER_ID;
        const songInfo = document.createElement("div"); songInfo.id = SONG_INFO_ID;
        const titleLineWrapper = document.createElement("div"); titleLineWrapper.className = TITLE_LINE_WRAPPER_CLASS;
        titleElement = document.createElement("h3"); titleElement.id = TITLE_ID; titleElement.textContent = "Loading..."; titleLineWrapper.appendChild(titleElement);
        youtubeLinkElement = document.createElement("a"); youtubeLinkElement.id = YOUTUBE_LINK_ID; youtubeLinkElement.target = "_blank"; youtubeLinkElement.rel = "noopener noreferrer"; youtubeLinkElement.title = "Watch on YouTube"; youtubeLinkElement.classList.add('hidden');
        const ytIcon = document.createElement("img"); ytIcon.src = ICON_YOUTUBE; ytIcon.alt = "YouTube"; youtubeLinkElement.appendChild(ytIcon); titleLineWrapper.appendChild(youtubeLinkElement);
        songInfo.appendChild(titleLineWrapper);
        artistElement = document.createElement("p"); artistElement.id = ARTIST_ID; artistElement.textContent = ""; songInfo.appendChild(artistElement);
        infoContainer.appendChild(songInfo);
        rightPanel.appendChild(infoContainer);

        const progressBarContainer = document.createElement("div"); progressBarContainer.id = PROGRESS_BAR_CONTAINER_ID;
        currentTimeElement = document.createElement("span"); currentTimeElement.id = CURRENT_TIME_ID; currentTimeElement.textContent = "0:00"; progressBarContainer.appendChild(currentTimeElement);
        progressBar = document.createElement("input"); progressBar.type = "range"; progressBar.id = PROGRESS_BAR_ID; progressBar.value = "0"; progressBar.min = "0"; progressBar.max = "100"; progressBar.step = "0.1"; progressBar.title = "Seek"; progressBar.style.setProperty('--progress-percent', '0%'); progressBarContainer.appendChild(progressBar);
        durationElement = document.createElement("span"); durationElement.id = DURATION_ID; durationElement.textContent = "--:--"; progressBarContainer.appendChild(durationElement);
        rightPanel.appendChild(progressBarContainer);

        const controlsContainer = document.createElement("div"); controlsContainer.id = CONTROLS_CONTAINER_ID;
        const controls = document.createElement("div"); controls.id = CONTROLS_ID;

        shuffleButtonElement = document.createElement("button"); shuffleButtonElement.id = SHUFFLE_BUTTON_ID; shuffleButtonElement.classList.add(PLAYER_CONTROL_BUTTON_CLASS, 'player-shuffle-button');
        const shuffleIcon = document.createElement("img"); shuffleIcon.alt = ""; shuffleIcon.src = ICON_SHUFFLE_OFF; shuffleButtonElement.appendChild(shuffleIcon); controls.appendChild(shuffleButtonElement);

        prevButtonElement = document.createElement("button"); prevButtonElement.id = PREV_BUTTON_ID; prevButtonElement.classList.add(PLAYER_CONTROL_BUTTON_CLASS); prevButtonElement.setAttribute('aria-label', 'Previous song'); prevButtonElement.title = 'Previous song';
        const prevIcon = document.createElement("img"); prevIcon.src = ICON_PREV; prevIcon.alt = ""; prevButtonElement.appendChild(prevIcon); controls.appendChild(prevButtonElement);

        playPauseButton = document.createElement("button"); playPauseButton.id = PLAY_PAUSE_BUTTON_ID; playPauseButton.classList.add(PLAYER_CONTROL_BUTTON_CLASS);
        const playPauseIcon = document.createElement("img"); playPauseIcon.alt = ""; playPauseIcon.src = ICON_PLAY; playPauseButton.appendChild(playPauseIcon); controls.appendChild(playPauseButton);

        nextButtonElement = document.createElement("button"); nextButtonElement.id = NEXT_BUTTON_ID; nextButtonElement.classList.add(PLAYER_CONTROL_BUTTON_CLASS); nextButtonElement.setAttribute('aria-label', 'Next song'); nextButtonElement.title = 'Next song';
        const nextIcon = document.createElement("img"); nextIcon.src = ICON_NEXT; nextIcon.alt = ""; nextButtonElement.appendChild(nextIcon); controls.appendChild(nextButtonElement);

        repeatButtonElement = document.createElement("button"); repeatButtonElement.id = REPEAT_BUTTON_ID; repeatButtonElement.classList.add(PLAYER_CONTROL_BUTTON_CLASS, 'player-repeat-button');
        const repeatIcon = document.createElement("img"); repeatIcon.alt = ""; repeatIcon.src = ICON_REPEAT_NONE; repeatButtonElement.appendChild(repeatIcon); controls.appendChild(repeatButtonElement);

        controlsContainer.appendChild(controls);

        volumeContainer = document.createElement("div"); volumeContainer.id = VOLUME_CONTAINER_ID;
        volumeIconElement = document.createElement("img"); volumeIconElement.id = VOLUME_ICON_ID; volumeIconElement.alt = "Mute"; volumeIconElement.title = "Mute/Unmute"; volumeIconElement.style.cursor = 'pointer'; volumeIconElement.src = ICON_VOLUME; volumeContainer.appendChild(volumeIconElement);
        volumePercentageElement = document.createElement("span"); volumePercentageElement.id = VOLUME_PERCENTAGE_ID; volumePercentageElement.textContent = "50%"; volumeContainer.appendChild(volumePercentageElement);
        volumeSlider = document.createElement("input"); volumeSlider.type = "range"; volumeSlider.id = VOLUME_SLIDER_ID; volumeSlider.min = 0; volumeSlider.max = 1; volumeSlider.step = 0.01; volumeSlider.value = 0.5; volumeSlider.title = "Adjust volume"; volumeContainer.appendChild(volumeSlider);
        controlsContainer.appendChild(volumeContainer);

        rightPanel.appendChild(controlsContainer);

        queueContainerElement = document.createElement("div"); queueContainerElement.id = QUEUE_CONTAINER_ID;
        queueTitleElement = document.createElement("h4"); queueTitleElement.id = QUEUE_TITLE_ID;
        queueTitleElement.innerHTML = `Up next <span id="${QUEUE_TOGGLE_ICON_ID}">${isQueueSectionExpanded ? "▼" : "▸"}</span>`;
        queueContainerElement.appendChild(queueTitleElement);
        queueListElement = document.createElement("ul"); queueListElement.id = QUEUE_LIST_ID; queueContainerElement.appendChild(queueListElement);
        mainPlayerArea.appendChild(queueContainerElement);

        const youtubePlayerDiv = document.createElement("div"); youtubePlayerDiv.id = YOUTUBE_PLAYER_DIV_ID; fragment.appendChild(youtubePlayerDiv);
        return fragment;
    }

    function loadYouTubeAPI() {
        return new Promise((resolve, reject) => {
            if (typeof YT !== 'undefined' && typeof YT.Player !== 'undefined') { resolve(); return; }
            window.onYouTubeIframeAPIReady = () => { resolve(); };
            const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
            if (existingScript) return;
            const tag = document.createElement('script'); tag.src = "https://www.youtube.com/iframe_api";
            tag.onerror = (err) => { console.error("Failed to load YouTube API script:", err); delete window.onYouTubeIframeAPIReady; reject(err); };
            const firstScriptTag = document.getElementsByTagName('script')[0];
            if (firstScriptTag && firstScriptTag.parentNode) firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            else document.head.appendChild(tag);
        });
    }

    function bindUIEventListeners() {
        if (!playPauseButton || !nextButtonElement || !prevButtonElement || !repeatButtonElement || !shuffleButtonElement ||
            !progressBar || !volumeIconElement || !volumeSlider || !playlistSelectorElement || !queueTitleElement) {
            console.error("Failed to bind listeners: Core UI elements missing.");
            return;
        }

        playPauseButton.addEventListener("click", togglePlayPause);
        nextButtonElement.addEventListener("click", () => {
            if (!hasUserInitiatedPlayback) {
                if (playlist.isEmpty()) return;
                hasUserInitiatedPlayback = true;
                playlist?.playNext();
                loadCurrentSong(true);
            } else {
                const wasPlaying = playerReady && ytPlayer?.getPlayerState() === YT.PlayerState.PLAYING;
                const shouldAutoplay = wasPlaying || repeatMode === 'all' || (playlist.currentSongIndex !== playlist.getSongs().length - 1);
                playlist?.playNext();
                loadCurrentSong(shouldAutoplay);
            }
        });
        prevButtonElement.addEventListener("click", () => {
            if (!hasUserInitiatedPlayback) {
                if (playlist.isEmpty()) return;
                hasUserInitiatedPlayback = true;
                playlist?.playPrevious();
                loadCurrentSong(true);
            } else {
                const wasPlaying = playerReady && ytPlayer?.getPlayerState() === YT.PlayerState.PLAYING;
                const shouldAutoplay = wasPlaying || repeatMode === 'all';
                playlist?.playPrevious();
                loadCurrentSong(shouldAutoplay);
            }
        });
        repeatButtonElement.addEventListener("click", toggleRepeatMode);
        shuffleButtonElement.addEventListener("click", toggleShuffleMode);
        volumeIconElement.addEventListener("click", toggleMute);
        queueTitleElement.addEventListener('click', toggleQueueExpansion);

        progressBar.addEventListener("mousedown", () => { isSeeking = true; stopRafUpdater(); });
        progressBar.addEventListener("touchstart", () => { isSeeking = true; stopRafUpdater(); }, { passive: true });
        progressBar.addEventListener("input", () => {
            if (!isSeeking || !hasUserInitiatedPlayback) return;
            const percentage = progressBar.value;
            progressBar.style.setProperty('--progress-percent', `${percentage}%`);
            if (playerReady && ytPlayer && typeof ytPlayer.getDuration === 'function' && currentTimeElement) {
                const duration = ytPlayer.getDuration();
                if (duration && isFinite(duration)) {
                    currentTimeElement.textContent = formatTime((percentage / 100) * duration);
                }
            }
        });
        progressBar.addEventListener("change", () => {
            if (!hasUserInitiatedPlayback) {
                isSeeking = false; return;
            }
            if (!playerReady || !ytPlayer || typeof ytPlayer.getDuration !== 'function' || typeof ytPlayer.seekTo !== 'function') {
                isSeeking = false; return;
            }
            const duration = ytPlayer.getDuration();
            if (!duration || !isFinite(duration) || duration <= 0) { isSeeking = false; return; }
            const seekTime = (progressBar.value / 100) * duration;
            ytPlayer.seekTo(seekTime, true);
            if (currentTimeElement) currentTimeElement.textContent = formatTime(seekTime);
            isSeeking = false;
            const state = ytPlayer.getPlayerState();
            if (state === YT.PlayerState.PLAYING) startRafUpdater();
            else stopRafUpdater();
        });
        const handleSeekEnd = () => { if (isSeeking) progressBar.dispatchEvent(new Event('change')); };
        progressBar.addEventListener("mouseup", handleSeekEnd);
        progressBar.addEventListener("touchend", handleSeekEnd);

        volumeSlider.addEventListener("input", () => {
            setVolumeFromSlider(true);
            updateVolumeIcon();
        });

        playlistSelectorElement.addEventListener("change", (event) => {
            const newIndex = parseInt(event.target.value, 10);
            if (!isNaN(newIndex)) {
                if (!hasUserInitiatedPlayback) {
                    loadNewPlaylistByIndex(newIndex, false);
                } else {
                    const wasPlaying = playerReady && ytPlayer && typeof ytPlayer.getPlayerState === 'function' && ytPlayer.getPlayerState() === YT.PlayerState.PLAYING;
                    loadNewPlaylistByIndex(newIndex, wasPlaying);
                }
            }
        });

        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    function injectPlayerStyles() {
        const styleId = "nice-music-player-styles";
        if (document.getElementById(styleId)) document.getElementById(styleId).remove();
        const style = document.createElement("style"); style.id = styleId;
        style.textContent = `
            :root {
              --player-bg: #ffffff; --player-border: rgba(0, 0, 0, 0.12);
              --text-primary: #212121; --text-secondary: #757575;
              --accent-color: #3F51B5; --accent-color-hover: #303F9F;
              --border-color: #EEEEEE; --cover-border-color: rgba(0, 0, 0, 0.08);
              --slider-track-bg: #E0E0E0; --slider-thumb-bg: #3F51B5;
              --slider-thumb-hover-bg: #303F9F; --progress-fill-bg: #3F51B5;
              --cover-art-size: 10rem;
              --base-font-size: 14px; --border-radius: 4px; --button-size: 36px;
              --small-button-size: 24px; --spacing-xs: 4px; --spacing-sm: 8px;
              --spacing-md: 16px; --spacing-lg: 24px;
              --font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              --title-font-size: 16px; --artist-font-size: 14px; --time-font-size: 12px;
              --transition-speed: 0.2s; --transition-func: cubic-bezier(0.4, 0, 0.2, 1);
              --queue-item-hover-bg: #f0f0f0;
            }
            #${PLAYER_ELEMENT_ID} { 
                background-color: var(--player-bg); border-radius: var(--border-radius); 
                font-family: var(--font-family); font-size: var(--base-font-size); 
                color: var(--text-primary); padding: var(--spacing-md); 
                box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); 
                margin: var(--spacing-md) auto; overflow: hidden; position: relative; 
                box-sizing: border-box; max-width: clamp(50rem, 70vw, 60rem);
            }
            #player-main-area { display: flex; flex-direction: column; }
            #${PLAYER_MAIN_CONTENT_WRAPPER_ID} {
                display: flex; align-items: flex-start;
                gap: var(--spacing-lg); width: 100%;
            }
            #${PLAYER_RIGHT_PANEL_ID} {
                display: flex; flex-direction: column;
                flex-grow: 1; min-width: 0;
            }
            #${PLAYLIST_SELECTOR_CONTAINER_ID} {
                display: flex; align-items: center; gap: var(--spacing-sm);
                margin-bottom: var(--spacing-sm);
            }
            #${PLAYLIST_SELECTOR_CONTAINER_ID} label { font-size: var(--artist-font-size); color: var(--text-secondary); flex-shrink: 0; }
            #${PLAYLIST_SELECTOR_ID} { 
                font-family: var(--font-family); font-size: 13px; padding: 4px 8px; 
                border: 1px solid var(--border-color); border-radius: var(--border-radius); 
                background-color: var(--player-bg); color: var(--text-primary); 
                flex-grow: 1; min-width: 150px; height: auto; box-sizing: border-box; 
                -webkit-appearance: none; -moz-appearance: none; appearance: none; 
                background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%204%205%22%3E%3Cpath%20fill%3D%22%23555%22%20d%3D%22M2%200L0%202h4zm0%205L0%203h4z%22/%3E%3C/svg%3E'); 
                background-repeat: no-repeat; background-position: right 8px center; 
                background-size: 8px 10px; padding-right: 25px; cursor:pointer; 
            }
            #${PLAYLIST_SELECTOR_ID}:focus { outline: 1px solid var(--accent-color); border-color: var(--accent-color); }
            .hidden { display: none !important; }
            #${DISPLAY_BOX_ID} { display: block; flex-shrink: 0; }
            #${COVER_ID} { width: var(--cover-art-size); height: var(--cover-art-size); object-fit: cover; border-radius: var(--border-radius); box-shadow: 0 1px 3px var(--cover-border-color); flex-shrink: 0; background-color: var(--border-color); transition: transform var(--transition-speed) var(--transition-func); }
            #${COVER_ID}:hover { transform: scale(1.03); }
            #${INFO_CONTAINER_ID} { display: flex; flex-direction: column; justify-content: center; overflow: hidden; flex-grow: 1; min-width: 0; padding: var(--spacing-xs) 0; }
            #${SONG_INFO_ID} { display: flex; flex-direction: column; overflow: hidden; justify-content: center; }
            .${TITLE_LINE_WRAPPER_CLASS} { display: flex; align-items: baseline; margin-bottom: var(--spacing-xs); gap: var(--spacing-xs); }
            #${TITLE_ID} { font-size: var(--title-font-size); font-weight: 600; margin: 0; white-space: normal; overflow-wrap: break-word; line-height: 1.3; color: var(--text-primary); flex-grow: 1; cursor: default; }
            #${YOUTUBE_LINK_ID} { flex-shrink: 0; line-height: 1; opacity: 0.7; transition: opacity var(--transition-speed) var(--transition-func); margin-left: 2px; }
            #${YOUTUBE_LINK_ID}:hover, #${YOUTUBE_LINK_ID}:focus { opacity: 1; }
            #${YOUTUBE_LINK_ID} img { width: 18px; height: auto; display: block; }
            #${ARTIST_ID} { font-size: var(--artist-font-size); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-secondary); line-height: 1.3; cursor: default; }
            #${PROGRESS_BAR_CONTAINER_ID} { width: 100%; display: flex; align-items: center; gap: var(--spacing-sm); margin: var(--spacing-sm) 0; }
            #${CONTROLS_CONTAINER_ID} { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: var(--spacing-md); margin-top: auto; }
            #${CONTROLS_ID} { display: flex; justify-content: center; align-items: center; gap: var(--spacing-sm); }
            .${PLAYER_CONTROL_BUTTON_CLASS} { background: none; border: none; cursor: pointer; border-radius: 50%; display: inline-flex; justify-content: center; align-items: center; width: var(--button-size); height: var(--button-size); opacity: 0.85; transition: all var(--transition-speed) var(--transition-func); padding: 0; margin: 0; flex-shrink: 0; outline: none; }
            .${PLAYER_CONTROL_BUTTON_CLASS}:hover { opacity: 1; transform: scale(1.08); background-color: rgba(0,0,0,0.05); }
            .${PLAYER_CONTROL_BUTTON_CLASS}:active { transform: scale(0.95); opacity: 0.9; }
            .${PLAYER_CONTROL_BUTTON_CLASS}:focus-visible { opacity: 1; outline: 2px solid var(--accent-color); outline-offset: 2px; }
            .${PLAYER_CONTROL_BUTTON_CLASS} img { display: block; width: 60%; height: 60%; user-select: none; -webkit-user-drag: none; -webkit-user-select: none; }
            #${PLAY_PAUSE_BUTTON_ID} { width: calc(var(--button-size) * 1.25); height: calc(var(--button-size) * 1.25); background-color: rgba(63, 81, 181, 0.08); }
            #${PLAY_PAUSE_BUTTON_ID}:hover { background-color: rgba(63, 81, 181, 0.12); }
            .player-repeat-button, .player-shuffle-button { width: var(--small-button-size); height: var(--small-button-size); opacity: 0.6; }
            .player-repeat-button.repeat-active, .player-shuffle-button.shuffle-active { opacity: 1; background-color: rgba(63, 81, 181, 0.1); }
            #${CURRENT_TIME_ID}, #${DURATION_ID} { font-size: var(--time-font-size); color: var(--text-secondary); flex-shrink: 0; min-width: 3.2em; text-align: center; font-variant-numeric: tabular-nums; }
            #${VOLUME_CONTAINER_ID} { display: flex; align-items: center; gap: var(--spacing-sm); flex-shrink: 0; }
            #${VOLUME_ICON_ID} { width: 20px; height: 20px; opacity: 0.7; cursor: pointer; transition: opacity var(--transition-speed) var(--transition-func); filter: brightness(0.2); padding: 2px; border-radius: 50%; user-select: none; -webkit-user-select: none; }
            #${VOLUME_ICON_ID}:hover { opacity: 1; background-color: rgba(0,0,0,0.05); }
            #${VOLUME_PERCENTAGE_ID} { font-size: 12px; color: var(--text-secondary); min-width: 2.5em; text-align: right; flex-shrink: 0; font-variant-numeric: tabular-nums; }
            #${VOLUME_SLIDER_ID} { width: 80px; flex-grow: 0; flex-shrink: 0; }
            input[type="range"] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; width: 100%; outline: none; transition: opacity var(--transition-speed) var(--transition-func); flex-grow: 1; height: 16px; vertical-align: middle; padding: 0; margin: 0; }
            input[type="range"]::-webkit-slider-runnable-track { height: 4px; background: var(--slider-track-bg); border-radius: 2px; }
            input[type="range"]::-moz-range-track { height: 4px; background: var(--slider-track-bg); border-radius: 2px; }
            #${PROGRESS_BAR_ID}::-webkit-slider-runnable-track { background: linear-gradient( to right, var(--progress-fill-bg), var(--progress-fill-bg) var(--progress-percent, 0%), var(--slider-track-bg) var(--progress-percent, 0%) ); }
            #${PROGRESS_BAR_ID}::-moz-range-track { background: linear-gradient( to right, var(--progress-fill-bg), var(--progress-fill-bg) var(--progress-percent, 0%), var(--slider-track-bg) var(--progress-percent, 0%) ); }
            input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; margin-top: -6px; height: 16px; width: 16px; background-color: var(--slider-thumb-bg); border-radius: 50%; border: none; box-shadow: 0 1px 2px rgba(0,0,0,0.2); transition: all var(--transition-speed) var(--transition-func); }
            input[type="range"]::-moz-range-thumb { height: 16px; width: 16px; background-color: var(--slider-thumb-bg); border-radius: 50%; border: none; box-shadow: 0 1px 2px rgba(0,0,0,0.2); transition: all var(--transition-speed) var(--transition-func); }
            input[type="range"]:hover::-webkit-slider-thumb { background-color: var(--slider-thumb-hover-bg); transform: scale(1.15); }
            input[type="range"]:hover::-moz-range-thumb { background-color: var(--slider-thumb-hover-bg); transform: scale(1.15); }
            input[type="range"]:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.3); transform: scale(1.15); background-color: var(--slider-thumb-hover-bg); }
            input[type="range"]:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.3); transform: scale(1.15); background-color: var(--slider-thumb-hover-bg); }
            input[type="range"]:active::-webkit-slider-thumb { transform: scale(1.2); background-color: var(--slider-thumb-hover-bg); }
            input[type="range"]:active::-moz-range-thumb { transform: scale(1.2); background-color: var(--slider-thumb-hover-bg); }
            #${VOLUME_SLIDER_ID}::-webkit-slider-runnable-track { height: 3px; }
            #${VOLUME_SLIDER_ID}::-moz-range-track { height: 3px; }
            #${VOLUME_SLIDER_ID}::-webkit-slider-thumb { margin-top: -5.5px; height: 14px; width: 14px; }
            #${VOLUME_SLIDER_ID}::-moz-range-thumb { height: 14px; width: 14px; }
			#${YOUTUBE_PLAYER_DIV_ID} { position: absolute !important; top: 0 !important; left: 0 !important; width: 1px !important; height: 1px !important; opacity: 0 !important; pointer-events: none !important; }
            
            #${QUEUE_CONTAINER_ID} { 
                margin-top: var(--spacing-md); 
                padding-top: var(--spacing-sm); 
                border-top: 1px solid var(--border-color);
                overflow: hidden;
                transition: max-height 0.3s ease-in-out;
            }
            #${QUEUE_CONTAINER_ID}:not(.queue-collapsed) {
                max-height: 150px;
            }
             #${QUEUE_CONTAINER_ID}:not(.queue-collapsed) #${QUEUE_LIST_ID} {
                 overflow-y: auto;
                 max-height: calc(150px - 2em - var(--spacing-sm));
             }
            #${QUEUE_TITLE_ID} { 
                font-size: var(--artist-font-size); 
                color: var(--text-secondary); 
                margin: 0 0 var(--spacing-sm) 0; 
                font-weight: 500;
                cursor: pointer;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            #${QUEUE_TOGGLE_ICON_ID} {
                font-size: 0.9em;
                margin-left: var(--spacing-xs);
                transition: transform 0.2s ease-in-out;
                display: inline-block;
            }
            #${QUEUE_LIST_ID} { list-style: none; margin: 0; padding: 0; }
            .${PLAYER_QUEUE_ITEM_CLASS} { 
                padding: var(--spacing-xs) var(--spacing-sm); 
                font-size: 13px; 
                border-radius: var(--border-radius); 
                cursor: pointer; 
                transition: background-color var(--transition-speed) var(--transition-func);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .${PLAYER_QUEUE_ITEM_CLASS}:hover { background-color: var(--queue-item-hover-bg); }
            .player-queue-item-title { font-weight: 600; color: var(--text-primary); }
            .player-queue-item-artist { color: var(--text-secondary); font-size: 12px; }
            .player-queue-empty { color: var(--text-secondary); font-style: italic; cursor: default; padding: var(--spacing-xs) var(--spacing-sm); }
            #${QUEUE_CONTAINER_ID}.queue-collapsed {
                max-height: calc(var(--artist-font-size) + var(--spacing-sm) + 2px);
            }
            #${QUEUE_CONTAINER_ID}.queue-collapsed #${QUEUE_LIST_ID} {
                display: none;
            }
            #${QUEUE_CONTAINER_ID}.queue-collapsed #${QUEUE_TOGGLE_ICON_ID} {
                transform: rotate(-90deg);
            }
            @media (max-width: 600px) { 
                :root { 
                    --cover-art-size: 100%;
                    --button-size: 32px; 
                    --title-font-size: 15px; 
                    --artist-font-size: 13px; 
                } 
                #${PLAYER_ELEMENT_ID} { padding: var(--spacing-sm); margin-inline: auto }
                #${PLAYER_MAIN_CONTENT_WRAPPER_ID} { flex-direction: column; gap: var(--spacing-md); }
                #${DISPLAY_BOX_ID} { width: 100%; } 
                #${COVER_ID} { max-width: 250px; margin: 0 auto; display: block; }
                #${PLAYER_RIGHT_PANEL_ID} { width: 100%; }
                #${INFO_CONTAINER_ID} { text-align: center; }
                .${TITLE_LINE_WRAPPER_CLASS} { justify-content: center; }
                #${ARTIST_ID} { text-align: center; }
                #${CONTROLS_ID} { justify-content: center; } 
                #${CONTROLS_CONTAINER_ID} { flex-direction: column; gap: var(--spacing-sm); }
                #${VOLUME_CONTAINER_ID} { justify-content: center; } 
                #${VOLUME_PERCENTAGE_ID} { display: none; } 
                #${VOLUME_SLIDER_ID} { width: 120px; } 
            }
        `;
        document.head.appendChild(style);
    }

    async function initializeMusicPlayer() {
        console.log("Setting up music player...");
        try {
            PLAYLISTS_DATA = [
                { name: "Default Mix", songs: SONGS_DATA },
                { name: "Alternate Mix", songs: PLAYLIST_TWO_DATA },
                { name: "Alternate Mix #2", songs: PLAYLIST_THREE_DATA }
            ];

            if (!PLAYLISTS_DATA || PLAYLISTS_DATA.length === 0 || PLAYLISTS_DATA[0].songs.length === 0) {
                console.warn("No default playlist or songs defined. Music player will be empty.");
                playlist = new Playlist([]);
                originalSongOrderForCurrentPlaylist = [];
            } else {
                activePlaylistIndex = 0;
                const initialPlaylistSongsData = PLAYLISTS_DATA[activePlaylistIndex].songs;
                const initialSongs = initialPlaylistSongsData.map(d => new Song(d.title, d.artist, d.coverLink, d.videoIds || d.videoId));
                originalSongOrderForCurrentPlaylist = [...initialSongs];
                playlist = new Playlist(initialSongs);
            }

            const playerFragment = createPlayerElements();

            if (playlistSelectorElement && PLAYLISTS_DATA && PLAYLISTS_DATA.length > 0) {
                PLAYLISTS_DATA.forEach((pl, index) => {
                    const option = document.createElement("option");
                    option.value = index.toString();
                    option.textContent = pl.name;
                    playlistSelectorElement.appendChild(option);
                });
                playlistSelectorElement.value = activePlaylistIndex.toString();
            }

            const anchorElement = document.getElementById("game_window");
            const targetContainer = (anchorElement && anchorElement.parentNode) ? anchorElement.parentNode : document.body;
            const insertBeforeElement = (anchorElement && anchorElement.parentNode) ? anchorElement.nextSibling : null;
            targetContainer.insertBefore(playerFragment, insertBeforeElement);

            injectPlayerStyles();
            bindUIEventListeners();
            updateUI();

            await loadYouTubeAPI();

            const playerDiv = document.getElementById(YOUTUBE_PLAYER_DIV_ID);
            if (!playerDiv) throw new Error(`Cannot initialize player: Element '${YOUTUBE_PLAYER_DIV_ID}' not found.`);

            ytPlayer = new YT.Player(YOUTUBE_PLAYER_DIV_ID, {
                height: '1', width: '1',
                playerVars: { 'playsinline': 1, 'autoplay': 0, 'controls': 0, 'disablekb': 1, 'modestbranding': 1, 'origin': window.location.origin },
                events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange, 'onError': onPlayerError }
            });

        } catch (error) {
            console.error("Failed during music player initialization:", error);
            if (titleElement) titleElement.textContent = "Error";
            if (artistElement) artistElement.textContent = "Could not load player.";
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMusicPlayer);
    } else {
        initializeMusicPlayer();
    }

})();
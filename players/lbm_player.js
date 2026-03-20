// The music player seen in
// 2012: Little Big Man.
(function () {
  'use strict';

  // The songs.
  const SONGS_DATA = [
    { title: "Think Harder", artist: "Sneaker Pimps", coverLink: "https://lh3.googleusercontent.com/7cBHblfdrmu5L73EFCMxvBxFOTIRxTAGm0V1Imy3kRxjkTOQ8HyETx30zsm_ztowFFrMayFcVb6b2LA=w544-h544-s-l90-rj", videoIds: ["n7mYEUCCk2o", "3PHA3wG0n3Y"] },
    { title: "The Hearts Filthy Lesson", artist: "David Bowie", coverLink: "https://lh3.googleusercontent.com/4IffEu2t5IQwTp3FZ97j88zwo7V5bMcFB4AM3JMdfqoqNJK-Q3V2fcF14FwU7idx679p3K8flkgxXKw=w544-h544-l90-rj", videoIds: ["6VKw3XS6QwY", "6H0XPzASySs"] },
    { title: "Maybe Tomorrow", artist: "Stereophonics", coverLink: "https://lh3.googleusercontent.com/PQ3qWgAnG23Xq_h5wQhIigyxZqMiHmD4K-NxrnlyzTYUf2RyxvK4EtVD32fpzxJNFvbHDdHSRclP0aM=w544-h544-s-l90-rj", videoIds: ["5ZHHR4cTkw4", "nIVLDtq7Oi8"] },
    { title: "Self-Obsessed and Sexxee", artist: "Sonic Youth", coverLink: "https://lh3.googleusercontent.com/28zoebdG3bZ9n33egEA1BFcxnX22t-X8seg0zCToXGfG5057NlLbrwaJJzrnq0lOTZbjHyDrnpPLwZM=w544-h544-l90-rj", videoIds: ["n3vHAEPAEMQ", "U9GJ-zwLROo"] },
    { title: "Please, Please, Please, Let Me Get What I Want", artist: "The Dream Academy", coverLink: "https://i.discogs.com/ePlDF3T5yoT_8atRhdieS0_Bl9OpMNZY8MQMnRn4wNE/rs:fit/g:sm/q:90/h:526/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTYxNjE2/NzgtMTYwMTQ4MTg3/Ny0yNTc0LmpwZWc.jpeg", videoIds: ["KfM__zbA5LA", "17ysGqMocbw"] },
    { title: "Such a Rush", artist: "Coldplay", coverLink: "https://lh3.googleusercontent.com/_QNq4qQ5rVJwrZAKIlKP-ov-efHyGgV0kUxECrJfNMR3I7n_dLWzavQ9m6o36nQZlFD2LKzi7tvB5LBV=w544-h544-l90-rj", videoIds: ["5bMzeIqiBBY", "9FY9rDqLNdE"] },
    { title: "Summer, Highland Falls", artist: "Billy Joel", coverLink: "https://lh3.googleusercontent.com/R9GDW4MbHuTy4cu6y1FdPt0C8SfE2QHLpLaHItII7w3ortP_HKesgvYi3_-3yBWu_0MRs1YHHHNZHjBEhA=w544-h544-l90-rj", videoIds: ["JJNHWd1V20Y", "1tQKW9aquT0"] },
    { title: "Beware", artist: "Deftones", coverLink: "https://lh3.googleusercontent.com/TOBgRvdH0szlTWlLMr5krn9lpO7XwmqlcoYflg4YQlLsEWH-CxREc-WTH1vw9oqsyj7zrlA0fSKkDZw=w544-h544-l90-rj", videoIds: ["FzjaN0gPvaE", "rwL2bIadXxs"] },
    { title: "Give Me The Cure", artist: "Fugazi", coverLink: "https://i.discogs.com/OIt1FRd98jrheWpDvfJRq-Mt6XZPNC8tdMRjBtaBBKI/rs:fit/g:sm/q:90/h:575/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIwMDY2/NTktMTQ3MjIyMDY0/MS0xMDIwLmpwZWc.jpeg", videoIds: ["kOskUqX4mBs", "XRxPUCYkeqU"] },
    { title: "Theme from M*A*S*H (Suicide Is Painless)", artist: "Manic Street Preachers", coverLink: "https://i.discogs.com/tfKzYJOnat11gp8YsG-sDhC3YvqKRQ3U4MP4qxPf3OE/rs:fit/g:sm/q:90/h:592/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTg5OTY3/My0xNjg2OTM4NzYw/LTgxNDQuanBlZw.jpeg", videoIds: ["z1RiRIIKi-4", "B5AJyWdjMiM"] },
    { title: "Superman (It’s Not Easy)", artist: "Five For Fighting", coverLink: "https://i.discogs.com/AlSl1GpuPFsPm2VUQE8qsHyRg34XJg63YukCH3qnUMo/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTY1NDg3/OS0xNjYxNDM3MTcw/LTcwMjMuanBlZw.jpeg", videoIds: ["EhCeEVN1EqM", "eZerzGMWSxU"] },
    { title: "We Take Care of Our Own", artist: "Bruce Springsteen", coverLink: "https://i.discogs.com/2wihzg8VjM1iyBK8HEaiEx4N438qGD_aybjJwQ5Je8M/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMzNTI4/MTktMTMyNjk5Mjg0/Ny5qcGVn.jpeg", videoIds: ["2UmI2DqoOEg", "-x8zBzxCwsM"] },
    { title: "Friday Night", artist: "Lily Allen", coverLink: "https://images.genius.com/94a9abdfe47f74fbd39bbac9dff5c0f7.568x568x1.jpg", videoIds: ["FWIM1KHOSrw", "eiEIQqvA7ZE"] },
    { title: "This Is for the Lover in You", artist: "Babyface, LL Cool J, Howard Hewett, Jody Watley, Jeffrey Daniels", coverLink: "https://i.discogs.com/NxKW8P5Us2KBwvqfb6sooBTEaZ6EvBL7AzL-jCYjCUQ/rs:fit/g:sm/q:90/h:598/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMxNjE2/ODMtMTQyNDYzNjU2/OS0zNTg2LmpwZWc.jpeg", videoIds: ["VnERswkqqVs", "mQzPugFiA4E"] },
    { title: "Lately", artist: "Tyrese", coverLink: "https://lh3.googleusercontent.com/d8GW75CVuHZx261ZcsxIEQZj1Ad0uNWcOyID11dIQpIqmZIvlzasHAzwCpJx6oxHjRjjrfY3a-c8Yyy2=w544-h544-l90-rj", videoIds: ["QC3bOkUjsyk", "iipy0pzaG8Y"] }, // { title: "Signed, Sealed, Delivered (I’m Yours)", artist: "Stevie Wonder", coverLink: "https://lh3.googleusercontent.com/HRuUSLkOF4brightVPyBp5lLCGq1qyxh8DgzMemPstzthCgkIUwt4f8FQX0Du8UhLFDJAivjHLde8DA1CD_4=w544-h544-l90-rj", videoIds: ["6To0fvX_wFA"] },
    { title: "Something In Common", artist: "Bobby Brown, Whitney Houston", coverLink: "https://i.discogs.com/etKm6dh-a4DewY903foxqW3zrs1_GiwAlt_AD0TBNgo/rs:fit/g:sm/q:90/h:600/w:592/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI0NTAz/MDctMTQ4MzI5MjQz/MC05ODI1LmpwZWc.jpeg", videoIds: ["LBuC3xOrU4k", "L4fxmWxqi2k"] },
    { title: "Go To Sleep", artist: "Roxette", coverLink: "https://lh3.googleusercontent.com/mZ8srffOfh3RopWfIHI8iot05vrqySxiHmDxHuxuBIsr93do0b9HJvhwMlsOjInl557LGBYnW5Z7ooC4=w544-h544-l90-rj", videoIds: ["ZtU5jA77Y2k", "aUTL207MJ1U"] }, // { title: "Come Fly with Me", artist: "Michael Bublé", coverLink: "https://i.discogs.com/6_trQ5xanqJ0HaeVwOGpXw_h28wjwAJu7U0iU_30RxM/rs:fit/g:sm/q:90/h:541/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQyNzcy/OTQtMTQ3ODI5Mzkz/Ni05MDk1LmpwZWc.jpeg", videoIds: ["Ma3yuYKSkxQ"] },
    { title: "Soon We’ll Be Found", artist: "Sia", coverLink: "https://i.discogs.com/jFM3JMHQBaUHadQO3_zKaPO5FJvGlQ77PO-HeQ7egjg/rs:fit/g:sm/q:90/h:540/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExNzAw/MzUtMTU0MzE0MDky/NC01OTM2LmpwZWc.jpeg", videoIds: ["Py0KJyaALrg", "t1x8DMfbYN4"] },
    { title: "Canned Heat", artist: "Jamiroquai", coverLink: "https://lh3.googleusercontent.com/LUVi3fNPg9ik8x8tUKDK38pvUIR6dSwKU0_bYF8CnWibZ_kbW-zU9GdQdvQ4whY8Y04yF6_br3K40_08=w544-h544-l90-rj", videoIds: ["-38yJGUvBD8", "TWbsUhi_p_g", "Fr1r1KINlvU"] },
    { title: "Going Down", artist: "A", coverLink: "https://lh3.googleusercontent.com/Q8W8Rv-ZLN1OYLDAdPq3l3x_MkAF8TGVUH6u3mh2OZhx8FSckJ0qdWDgMnYF9YGKvkAQrr4ZMkYvdvUM=w544-h544-l90-rj", videoIds: ["GCIZTanBU7w"] },
    { title: "Endlessly", artist: "Muse", coverLink: "https://lh3.googleusercontent.com/pYoc6fyzEsIQhv9CB5YDlThePpQhPmh6wJBUZmzaK7Hge6wi47Aynu5UXI9FqLgvinFw5ccW6bodbXM=w544-h544-l90-rj", videoIds: ["m5BvNMkVnQs"] },
    { title: "Self Esteem (2008 Remaster)", artist: "The Offspring", coverLink: "https://i.discogs.com/2B9OCOSOO3pEDJ1iWizbqpvtjyMgJ9n58M-tMFRZBHc/rs:fit/g:sm/q:90/h:597/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTU0NDkz/OC0xNDk0MDE4ODk0/LTU5MDQuanBlZw.jpeg", videoIds: ["7ifeDVAE_Zg"] },
    { title: "She’s So High (2012 Remaster)", artist: "Blur", coverLink: "https://i.discogs.com/DZGMPD7bu-Tka37c1RJi5e2DRCCvlC21BwMFl5zpUH4/rs:fit/g:sm/q:90/h:593/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ0ODY3/Ny0xNjAzNjU5NDgy/LTYwMTYuanBlZw.jpeg", videoIds: ["DPQ0UJyFYSY"] },
    { title: "Angels Too Tied to the Ground", artist: "U2", coverLink: "https://i.discogs.com/3tA1or-DPJBCkyh70A3NcVuk0HinU9aYVGF3nTED-TE/rs:fit/g:sm/q:90/h:563/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE5NzQ4/NzMtMTI1NjE0MDgy/NC5qcGVn.jpeg", videoIds: ["QTf0EgDCEwQ"] },
    { title: "747 (We Ran Out Of Time)", artist: "kent", coverLink: "https://lh3.googleusercontent.com/3svZrSnARmXYlj0OKULKOdOtRch49PL8YWbbOOdpZm6_sPNJBrUGeAmR4PMgvgcfoYE_BihOfQ7tTr6p=w544-h544-l90-rj", videoIds: ["2npGuZKdhgE"] },
    { title: "I’m a Firefighter", artist: "Cigarettes After Sex", coverLink: "https://lh3.googleusercontent.com/1p6o0pMKzWRTzgI0XcQFT7aCLra6t5tQJdZc3qUh_q0ipCzfMuzxZYwkLVHGoI-Vus22IDPvCv1_wOCYMw=w544-h544-l90-rj", videoIds: ["M2pTEv6P6lk"] },
    { title: "When Love Breaks Down", artist: "Prefab Sprout", coverLink: "https://lh3.googleusercontent.com/noT9YG5qmryaW194pLik6An485FjtVChXh2ZrUeT7tGvhSSfNqdy1yyjUlwvFtOvak8uX4ZB0ZddLu4=w544-h544-l90-rj", videoIds: ["jD0LrnM269g"] },
    { title: "Call Mr. Lee", artist: "Television", coverLink: "https://file.garden/aNtAfG887DiA_7lO/2012LBM/television.png", videoIds: ["VeIoKtnPBiQ"] }, // { title: "Soldier Blue", artist: "Richard Lloyd", coverLink: "https://lh3.googleusercontent.com/7hf0rebbVTVQm656_UPLfzYfcq3shX_cLQHbcBlngdMfyhf4hhZK9dYeXbu4eYzKYpqSvn2jmRTchXI=w544-h544-l90-rj", videoIds: ["WFibfRCTvS0"] },
    { title: "The Last of the Famous International Playboys", artist: "Morrissey", coverLink: "https://i.discogs.com/-PRvkPqdx9Bs3_kEEyNG52xgcbOUUXPMR1ZrWU82X6w/rs:fit/g:sm/q:90/h:522/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ2MTQ0/NC0xMTE2ODY3NTY0/LmpwZw.jpeg", videoIds: ["z-kXRbWwh6s"] },
    { title: "Mysterons", artist: "Portishead", coverLink: "https://file.garden/aNtAfG887DiA_7lO/2012LBM/mysterons.webp", videoIds: ["slDNOtOQ8oA"] }, // { title: "Sour Times", artist: "Portishead", coverLink: "https://lh3.googleusercontent.com/MCoXTUz64Gz2wDS-Gpb7PCOhtrySBsX3GFW9C0lDIiH3mZFVOXuoa0lOpUiGhNAl9uvJv9BmRvUNcmM=w544-h544-l90-rj", videoIds: ["VoSoZyiHZ6o"] },
    { title: "I’ll Try Anything Once", artist: "The Strokes", coverLink: "https://lh3.googleusercontent.com/WgxP6c6wwhh-IuX7N48bzsNeJNo0_OTHfrIlmjnv_3XvXb1I-rOCude_IkLetOZAvyqwnEX2v86fKyc=w544-h544-l90-rj", videoIds: ["_m8Q93ubyJI"] },
    { title: "A Wolf At The Door", artist: "Radiohead", coverLink: "https://i.discogs.com/UkpecGXuUNTB3ausYZixGsN1V2MdSJ0Gj9y0-U-MFc4/rs:fit/g:sm/q:90/h:599/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIyMTY5/OC0xNTA2NzY0NTA4/LTc0ODMuanBlZw.jpeg", videoIds: ["6isz01iv8Ls"] },
    { title: "You Get What You Give", artist: "New Radicals", coverLink: "https://i.discogs.com/qc-nMODKSFaRgEox8O7O_Auh6O-2i8oBmEATWCptUyQ/rs:fit/g:sm/q:90/h:598/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExNDE2/NzAtMTI1NjUwMTk2/NC5qcGVn.jpeg", videoIds: ["j91RZ01PZwA"] },
    { title: "Accidentally In Love (From “Shrek 2” Soundtrack)", artist: "Counting Crows", coverLink: "https://i.discogs.com/vs9VpF6GOU5Ap4ms0Qmibz7pcY91H-SiUrAtHX81XkE/rs:fit/g:sm/q:90/h:537/w:540/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQxNzIz/NDQtMTM1NzY0NDM1/OS0xNTA4LmpwZWc.jpeg", videoIds: ["vnBec1gpXSM", "GEo7W-uJNkc", "StFssXdXPZM"] },
    { title: "Sick and Tired", artist: "Anastacia", coverLink: "https://i.discogs.com/oftF3PUnB53AC9dgI1yVUg24reQKN5jc8E59cBw0Hos/rs:fit/g:sm/q:90/h:600/w:589/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM2NDI3/Ni0xMjU2NzU4OTc1/LmpwZWc.jpeg", videoIds: ["zc3NG898LGU"] },
    { title: "Walk", artist: "Foo Fighters", coverLink: "https://lh3.googleusercontent.com/tT__3cVHvuFo7lttNU4D1ApF6beZZjGIGHfrqORR4UYe0fQRo_xK0Me2gslp8J9fdCyvkWyzChWWvJY=w544-h544-l90-rj", videoIds: ["FQU0QOmwHFA"] },
    { title: "Empire Ants", artist: "Gorillaz, Little Dragon", coverLink: "https://i.discogs.com/MuLrvRctIA1_1pS9REPh1l9FnwmWY2iDPAMNtdthEl0/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI0NDA4/MTgtMTQwMTM3MTA0/MC0yNjI0LmpwZWc.jpeg", videoIds: ["5XZGVcHysNk"] },
    { title: "Kids", artist: "Robbie Williams, Kylie Minogue", coverLink: "https://lh3.googleusercontent.com/HRnmS-xgMig6MbL_I7eJlM5_sM3lZvvI3ecNLX-hwaT0T7q1J7MFQlQbCEvyHTpRwN8idBktAUxhNEo=w544-h544-l90-rj", videoIds: ["5X7JPiHfEIk"] },
    { title: "My Mistakes Were Made For You", artist: "The Last Shadow Puppets", coverLink: "https://lh3.googleusercontent.com/zYeSM5_i-ceJPLhMvwyPqxqYwAOqmWhYiwFtwvL2H81QH-0DKfM-IVtyM5T5rHNsRbRvFoa51i2YZW9W=w544-h544-l90-rj", videoIds: ["d2knSgBJpgU"] }
  ];
  const PLAYLIST_TWO_DATA = [
    { title: "A Thousand Years", artist: "Sting", coverLink: "https://lh3.googleusercontent.com/K_am-j3mqErHoss6AOgDHi6U5QdkkY4oU8oNvRVEfYR7PjM9QsHLUuuyDvRfWwvsQXhm9DRrptlrjLOKdA=w544-h544-s-l90-rj", videoIds: ["aI4t0VJO0IQ"] },
    { title: "Cowboys and Angels", artist: "George Michael", coverLink: "https://i.discogs.com/Cgnm9bmq_6lXq7nmzv6dJs-ud9-NWvp85ztqlfYrfG4/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEzMDQ2/NDktMTIwODA3ODU4/Mi5qcGVn.jpeg", videoIds: ["Fcs9DLlHsPI", "Jvt_yJwOiS4"] }, // { title: "Round Here", artist: "George Michael", coverLink: "https://file.garden/aNtAfG887DiA_7lO/roundhere.png", videoIds: ["-u7b36yNhPY"] },
    { title: "Chasing Pirates", artist: "Norah Jones", coverLink: "https://lh3.googleusercontent.com/RUgNv8AWzsTvSzmYmyBSADbemTwC-sPWZ0cJclAY7EgKrmDqLwd0I9mttILu5lfblk_SzOp_VgqiYk4=w544-h544-l90-rj", videoIds: ["nSABeBkDynM"] },
    { title: "Morning Theft", artist: "Jeff Buckley", coverLink: "https://file.garden/aNtAfG887DiA_7lO/2012LBM/morningtheft.jpg", videoIds: ["gxJI7hlPdnY"] },
    { title: "Crosseyed and Painless", artist: "Talking Heads", coverLink: "https://lh3.googleusercontent.com/wfQhN_HmBrEPuuGg_RxL6UJW982q0q4duInnmR2hRNqqXIWB2WSh8Jl-5rHuwrSHs0VEDiBnWe7jlBkqAQ=w544-h544-s-l90-rj", videoIds: ["z92avHmgDRA"] },
    { title: "Days Are Forgotten", artist: "Kasabian", coverLink: "https://lh3.googleusercontent.com/Ys0dPw_Gik7p3zPLZxVFUryU-DP3myOzWT1MZDMln0yxStvusjMjxV4LgRoh8w68JqmS9K_H1pdYErY=w544-h544-l90-rj", videoIds: ["jhvhEbXrGNg"] },
    { title: "Perfect", artist: "The Smashing Pumpkins", coverLink: "https://lh3.googleusercontent.com/sAtXMFJyFHd453qhed8ElAkosVqdNcu1qfmce_qfiLcRSRR19Js8fDdBHfrmg5j7Ax0F9pPkEH8mCZKVlw=w544-h544-l90-rj", videoIds: ["J6akOLBPHRs"] },
    { title: "Light A Roman Candle With Me", artist: "fun.", coverLink: "https://lh3.googleusercontent.com/0XUUFPo3k8VjVu8psofYl4iLnNgEqHhxQQY5riGQa-3h_ZkG6NjySj-mwixau3Q27F9gQ_MuWa2qPrzV=w544-h544-l90-rj", videoIds: ["xiVZfzwPxpk"] },
    { title: "Make It Wit Chu", artist: "Queens Of The Stone Age", coverLink: "https://i.discogs.com/PZSCqtjD-xNiPGauhEi41xtI49_fweDacRoZht9T_OQ/rs:fit/g:sm/q:90/h:597/w:586/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExNjA2/MjktMTE5NzE5MzQ3/MS5qcGVn.jpeg", videoIds: ["AZdyD8yFQaU"] },
    { title: "Burndt Jamb", artist: "Weezer", coverLink: "https://lh3.googleusercontent.com/k4nOOBSgcSfOm4z8tXvsXtdv1A2srufsx24kM8k_K6Nh2-rjV-zawEjEj91GB3KGr9Z5kWcn-ouTJWE=w544-h544-l90-rj", videoIds: ["g8HxirtezmI"] },
    { title: "Chasing Pavements", artist: "Adele", coverLink: "https://lh3.googleusercontent.com/4RvEdXVK1IS7ZZws_vUD443HM8eKqN890he0S_w8cw06GEdmUVNatd0Rd2aiAxpzwlBam6OS8Rh94hlk=w544-h544-l90-rj", videoIds: ["WSq2jQjzcMg"] },
    { title: "The Heart Remains A Child", artist: "Everything But The Girl", coverLink: "https://lh3.googleusercontent.com/evBbcN1l_cXZ3tHU2684sxjIznFgLYj8o9oEKzrk_Svtbszmz8VamKsgb05KjTilnpai69en0nOF-g9u=w544-h544-l90-rj", videoIds: ["fj_iHszkexw"] },
    { title: "Love Voodoo", artist: "Duran Duran", coverLink: "https://i.discogs.com/SFalan_KgA4zCavkJg_OOnTAXIly0QvS6D25Nuf67rw/rs:fit/g:sm/q:90/h:431/w:438/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEyOTM1/MDQ1LTE1NDQ4NjU1/MjctODkyMS5qcGVn.jpeg", videoIds: ["Ra_bvxg24eQ"] },
    { title: "Our Velocity", artist: "Maxïmo Park", coverLink: "https://i.discogs.com/z1Y9bX-84ac-_To_IWlNJ3qkKo0x2nzuUTKWgkNSqV0/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTkzMDE0/NS0xMTc0MDY4ODM0/LmpwZWc.jpeg", videoIds: ["oPuXbw5e9yA", "bgRYs1Afb5M", "GLjGlePMkEU"] },
    { title: "Long Snake Moan", artist: "PJ Harvey", coverLink: "https://i.discogs.com/WH871g2QdZQ59j-ZnO_fWIxTQmfvBYVMDLeyJmCgQQk/rs:fit/g:sm/q:90/h:481/w:556/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE0NDI0/OTgtMTQ5MzU5MjA1/Ni0yNDI4LmpwZWc.jpeg", videoIds: ["mbuvj1k_LIc", "zUOcl38-6dE"] },
    { title: "Heads Will Roll", artist: "Yeah Yeah Yeahs", coverLink: "https://lh3.googleusercontent.com/8Sfi-dys3oJEdKMn4-HDuycmf1GrpuUcV-DU23N7Gh8gCp_X3Y2VZGTNs4Ni4_oujpuQlbWq9Hq_iBqu=w544-h544-l90-rj", videoIds: ["vw3k_jWa-gI", "I4lU8zOUI7Y"] },
    { title: "Throb", artist: "Janet Jackson", coverLink: "https://lh3.googleusercontent.com/IGqFlmfmWSdFJ9dv5dntPDEDAZ08oISLs-98JzQFy9HsF0hJEnxDX8T-WNc6Yikhstf1xRttBUERj6pt7w=w544-h544-l90-rj", videoIds: ["GV5fowmEP5M"] },
    { title: "Time to Pretend", artist: "MGMT", coverLink: "https://i.discogs.com/VWmHOLds8WRxC2pEwdsVsKoRS5nbyhtUgZNI-w65h5o/rs:fit/g:sm/q:90/h:509/w:500/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEyNjkx/MTMtMTM4NjY3NDY1/Mi0xMzkxLmpwZWc.jpeg", videoIds: ["XUKyV49P8F0"] },
    { title: "Concrete Jungle", artist: "Céu", coverLink: "https://lh3.googleusercontent.com/W32ORCD-R5kvkeBdOKcsu1LzsEQ5720vOKtyWkA9Vz-kNDWlhIMNkBhCRlUUaTI04yacTPkhflp9ynCa=w544-h544-l90-rj", videoIds: ["wvvVcD1upgw"] },
    { title: "Pictures Of Me", artist: "Elliott Smith", coverLink: "https://lh3.googleusercontent.com/A5Zy_MEPXIZvSughy-1GFQgIGQfqbXhPpw7SO1xCAkaFE3M767xGIFLEPJSS2VwXOeoiny_HVvPDL0TU=w544-h544-l90-rj", videoIds: ["DjQfF137Jo8"] },
    { title: "Ghosts (2003 Remaster)", artist: "Japan", coverLink: "https://i.discogs.com/03rpCahE4xIIliFWZt7KWSSM5_3l-R8P-nmzr1Q_cBo/rs:fit/g:sm/q:90/h:600/w:587/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTc0MTE4/LTE0MDkzMzk1NTIt/NjAyOS5qcGVn.jpeg", videoIds: ["0cLeyGWthgw"] },
    { title: "Dark Is the Night for All", artist: "a-ha", coverLink: "https://lh3.googleusercontent.com/f8-e6ocHhH8PeCqBLYGx7oPE0YtFi6-NrL4K6dx2D-Z8mAJzIp-OAJ8MHZnLWYtt-bOGwRkG85ELtJM=w544-h544-s-l90-rj", videoIds: ["PInnL2kCHRs"] },
    { title: "The Same Deep Water As You", artist: "The Cure", coverLink: "https://lh3.googleusercontent.com/rHZvGGWVWMXiOmAKzYJJV1S4ob2iPfHEQFruiKu3d3qkb5L9969m3gVlQN0Y-vdKL6g4xc8-qCirWaQY=w544-h544-s-l90-rj", videoIds: ["YBTo-QVJjBo"] },
    { title: "Break The Night With Colour", artist: "Richard Ashcroft", coverLink: "https://i.discogs.com/2YXfsoSBpr5BevuoOwwM4jRtbQX_CSPzKEHYEcIZ9mE/rs:fit/g:sm/q:90/h:528/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE4MDg0/MTEtMTMxNjc5ODMy/MS5qcGVn.jpeg", videoIds: ["lLUm32FhWBo"] },
    { title: "Human Nature", artist: "Madonna", coverLink: "https://i.discogs.com/1AEA6xxFw0cLauqdRj7Gs-Ptnb7jKWk9Tcv3POFCSbQ/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQwOTAz/LTE0NTQxNzE3NzQt/MzU0Ny5qcGVn.jpeg", videoIds: ["U_V5H571qu0"] },
    { title: "Pop Life", artist: "Prince", coverLink: "https://lh3.googleusercontent.com/49t0gzowaxk4UjzX2GZOI2SaUak-Rg9nV5t64HzCubA69hTyzfao0vgaiABEVNN2RRQDwvDqqU6Nk6CZ=w544-h544-l90-rj", videoIds: ["bQT0zS0PCb4", "56Hvoqgdlfk", "dtZO8J7rXLo"] }, // { title: "Musicology", artist: "Prince", coverLink: "https://lh3.googleusercontent.com/TbspPdUPFM6Wn8OqCOC3dtIsE8ONI8yH3E6RvhRrQUddY1H2C8ZqAUc_Zl-lcquUbxmylxPhDNKzTdND=w544-h544-l90-rj", videoIds: ["qdmWbJ8ISP4"] },
    { title: "More Than A Woman", artist: "Angie Stone, Calvin Richardson", coverLink: "https://lh3.googleusercontent.com/rfA1DXHqrzSCACAFhmQ5FVPvXfwJoV2hcmG6nIByy6lVFJ68kHwil_TD0zZSE-eFHke7Wr9xc_UT9oR8=w544-h544-s-l90-rj", videoIds: ["V3wXb3dRaRY"] },
    { title: "Poetic Justice", artist: "Kendrick Lamar, Drake", coverLink: "https://i.discogs.com/NLeNttmSqcPzu5ynjMos5cnFW9nnHfLp4Pu8f5lK-wU/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEwMzYx/MzEyLTE1MzMyMjg2/MjAtNjYyMy5qcGVn.jpeg", videoIds: ["XWQJdnmpnhc"] },
    { title: "What If", artist: "Aaliyah", coverLink: "https://i.discogs.com/o1FTmFfngKpHfJZcaBI2pes0Yx8ik_0KL6HdbKCdNqI/rs:fit/g:sm/q:90/h:529/w:598/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI1MjUy/MjYtMTQ3MDE1MjI3/My00NDQxLmpwZWc.jpeg", videoIds: ["9zNfpjn6Yno"] }, // { title: "We Need A Resolution", artist: "Aaliyah, Timbaland", coverLink: "https://i.discogs.com/cD-yVP5rRvHiusqqF3sxxYxIl5YAxJOXyECrc0E10g4/rs:fit/g:sm/q:90/h:600/w:593/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTcxOTE0/MzQtMTQzNjAxMzU0/OS0zODA4LmpwZWc.jpeg", videoIds: ["bTk0fF2aTfU"] },
    { title: "Take A Toke", artist: "C&C Music Factory", coverLink: "https://i.discogs.com/jNLB4gBh-S33ZhtiPKEXD51biultek1apXaFzg4g2wA/rs:fit/g:sm/q:90/h:554/w:550/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM1OTE2/OC0xMjc4NDA3ODIw/LmpwZWc.jpeg", videoIds: ["NWuYrQXfWyQ"] },
    { title: "Computer World (2009 Remaster)", artist: "Kraftwerk", coverLink: "https://lh3.googleusercontent.com/lFxYtC0uMQuVL6wZo2dLLJO4MBYBdg-FIMNiF0axD3vG4Tswx7qdmarZTY2frhrqBan0LQPWLnntAkE=w544-h544-l90-rj", videoIds: ["Pgf7Uz7Xxek"] },
    { title: "Take It Like A Man", artist: "KMFDM", coverLink: "https://lh3.googleusercontent.com/_WaQu0NR98If7tyBU7p1aUb4ak1q50mUmVU3gSFFTqvPEcOZzjr5QA2JpM9OeDeD-gACMeO10K4nal8=w544-h544-l90-rj", videoIds: ["EQto-edK_8w"] },
    { title: "Sexplosion", artist: "My Life With the Thrill Kill", coverLink: "https://lh3.googleusercontent.com/FnBckYjD1li2kKoGUA6XIELAT-im7tueQpbadBbRvZaSGrOokiBO6OjFWzOa759eJhUSru1sBVcPiSIE4g=w544-h544-l90-rj", videoIds: ["uBTBC7PpOIc"] },
    { title: "Lovesong", artist: "Snake River Conspiracy", coverLink: "https://lh3.googleusercontent.com/_Sv-qfk2yphilaUfu-AEEzMxRy3Wjxx45FCjLzX7SJdUuk6eHEGzjT33Y9YajvMP4Dj-TnvCDGr8eXhB=w544-h544-l90-rj", videoIds: ["N_Y5cHNKbgg"] },
    { title: "Revenge", artist: "Ministry", coverLink: "https://lh3.googleusercontent.com/OgGEwF9SdxUO4zTpz9SEoDq426VTBui-m04WbT1QY-vBfUfY_bA4qvOnCyNmmt4tffSB7ihGBfUUG94=w544-h544-s-l90-rj", videoIds: ["jfoAxDBpB88"] },
    { title: "Breathe", artist: "Basement", coverLink: "https://lh3.googleusercontent.com/dmNVje7d_6fcRgp0o7r3Gqfikwb8FzbqPplvLetb0nOIiHH-wb-56WJ2wctqs7vA8-Pu_nPD08UzIGnk=w544-h544-l90-rj", videoIds: ["c3BIn-sslxg"] },
    { title: "Blue Sky Mine", artist: "Midnight Oil", coverLink: "https://lh3.googleusercontent.com/2ZkKru5W8od5qdSywn-emupTOLJ9eYVV5I5S-aQvTVbzf-Ek-vfcQoWeAhvzBZLWBc5Eio_PMQEFSJvoqA=w544-h544-l90-rj", videoIds: ["E2Ru4_A8INU"] },
    { title: "Violet", artist: "Savage Garden", coverLink: "https://lh3.googleusercontent.com/otK781lcTCrWL8qTWVss4tSglJ4-ysRk9zzTeSnb0aJwAUWN5kOaNJtdLQ2Hk8tYe4A4oASA31Ai308HaQ=w544-h544-l90-rj", videoIds: ["K0NqQDNgG44"] },
    { title: "Closing Time", artist: "Semisonic", coverLink: "https://i.scdn.co/image/ab67616d0000b273732c06860d83e1d738ea1309", videoIds: ["5IXBuSVqyNk"] },
    { title: "Gardening At Night", artist: "R.E.M.", coverLink: "https://lh3.googleusercontent.com/GoXoiNqZAbKJjDmCaVlrEdeW_whTaS3eqxXPe_-CgOQqNGui1SP6ai737dxA5wui6qDPbHSvStDQeeGH=w544-h544-l90-rj", videoIds: ["ygiHqQdVvbg"] },
    { title: "Drive You Home", artist: "The Verve", coverLink: "https://file.garden/aNtAfG887DiA_7lO/2012LBM/verve.png", videoIds: ["7OyRW_UqMu8"] },
  ];
  const PLAYLIST_THREE_DATA = [
    { title: "Mellow My Mind", artist: "Simply Red", coverLink: "https://lh3.googleusercontent.com/SrJ6ZNRfFZTX7u7IKmoGWfjvRDW_ZuvVJVtIgG5_tUgqcL8PH6lCpBxzaNwxYUNZCBIQlKjXQU_IVT2f=w544-h544-l90-rj", videoIds: ["1b66vvkJnV4", "oOfWPsFpuHY", "ddz1_1bEwLI"] }, // { title: "Jericho (Single Mix)", artist: "Simply Red", coverLink: "https://lh3.googleusercontent.com/u1jeJkgmSIycHjWNXexFMsqidX1wWiQhBlvkaae9Gqr5wZ9-AQrTtc9ITm9AkqWWbf0xLrF-nfwumTc36w=w544-h544-l90-rj", videoIds: ["q0g9Bm_A2tc"] },
    { title: "Sympathy For The Devil (Neptunes Remix)", artist: "The Rolling Stones, The Neptunes", coverLink: "https://lh3.googleusercontent.com/47HJHBCLOA9roigjSWmuvSxeDjNKXHVukzv-EHO2s5exAbsSneiY6agwS2ocv4w1vSkkjJ2eEHMzP6w=w544-h544-s-l90-rj", videoIds: ["btfCucCnIJY"] },
    { title: "Then She Appeared", artist: "XTC", coverLink: "https://lh3.googleusercontent.com/Dhi8MUltkljAhJUfX6HVbL6sXxsEndmUP-CdFnlUOMl4UA-KPBBg2Ib749GDYJBAoVHGtuujgXMVXlCWqA=w544-h544-l90-rj", videoIds: ["J33GAxtmKxU"] },
    { title: "Money Can’t Buy It", artist: "Annie Lennox", coverLink: "https://lh3.googleusercontent.com/HLFaLtDwI8Zxs0RDA1mH6K6ykq2BIXOjN6E7w6UVq0gmKTEfIhlV7nripddwL6zft3XvgrEEH5a0Bug1=w544-h544-l90-rj", videoIds: ["LBL5xz4ptnQ"] },
    { title: "Wrapped Up In Books", artist: "Belle and Sebastian", coverLink: "https://lh3.googleusercontent.com/79BQs1ZXWfe_BAZwL02Ub-lndYlO1keXD0vpU6OStOelV_jvr30ajhWa0FFZlSn4wyJZ3wjTLDm98pTC5Q=w544-h544-l90-rj", videoIds: ["4pgGLysxaoI"] },
    { title: "The Sea", artist: "Morcheeba", coverLink: "https://lh3.googleusercontent.com/jBB1DppZrbazEN8WkCBzN-m7JKiUnfS1hZZNv6XAkqqPkYviyfyVOcfL0ayTNlAQc4Z2MabmkMHHS5NsaA=w544-h544-s-l90-rj", videoIds: ["rOLN9T9w9kA"] },
    { title: "Gangnam Style", artist: "Psy", coverLink: "https://lh3.googleusercontent.com/_cEhL7XVzoVbxoFAYM6fSncb_6PGYcM5EUFw0tNY27hJoqz0EnqS3t2ZgSWHKxQk0eF4pC3M6ZxUIc8=w544-h544-l90-rj", videoIds: ["4AgDYTuZWOw"] },
    { title: "Morphine", artist: "Michael Jackson", coverLink: "https://file.garden/aNtAfG887DiA_7lO/2012LBM/c85TB64.jpeg", videoIds: ["hwihNQCTDIU"] },
    { title: "Touch Myself", artist: "Genitorturers", coverLink: "https://lh3.googleusercontent.com/m3WZ_7kuWrKZ-vw8iJM1Q8FYh9PRIgRQ7c_3AGkrHwTsJR2Thkohkmd7Vu1keBVn8aJ0GI6c1mhaMbr3=w544-h544-l90-rj", videoIds: ["j06PkVMpA1U"] },
    { title: "I Need Something (To Kill Me)", artist: "Twenty One Pilots", coverLink: "https://i.discogs.com/4IWnyyOst-3aEZp10FDcapIGd0oIi7Xf3Dy9ssVyhAE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE0MDY3/NzQ1LTE1NjcyMTMz/NjAtNjc2MS5wbmc.jpeg", videoIds: ["VWtUlvo9t5g"] },
    { title: "Ricky", artist: "Yoñlu", coverLink: "https://file.garden/aNtAfG887DiA_7lO/2012LBM/ricky.webp", videoIds: ["Wm-_X9d9C_o"] },
    { title: "My Way", artist: "Sid Vicious, Sex Pistols", coverLink: "https://i.discogs.com/GxsduuyVsB1UDm1duEbF6Qo0lf9r8kpiBHT7gzdQV9g/rs:fit/g:sm/q:90/h:600/w:596/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTc1NDE3/MjktMTY3ODgxNzU1/My03NjA1LmpwZWc.jpeg", videoIds: ["BWKDInTo3CE"] },
    { title: "Standing In The Paris Rain", artist: "Avant Garde", coverLink: "https://file.garden/aNtAfG887DiA_7lO/2012LBM/avantgarde.jpeg", videoIds: ["O2mgZVOpjDk"] },
    { title: "I Wanna Rock You", artist: "Giorgio Moroder", coverLink: "https://i.scdn.co/image/ab67616d0000b273f7a48e970946e513c2c50600", videoIds: ["PTuaWSfwnj8"] },
    { title: "Praise You", artist: "Fatboy Slim", coverLink: "https://lh3.googleusercontent.com/Q7t3Ps65dK8MKfvoxTTc7YfJn7whALfS1ENDQPdxyM5RBqfVF1SEKL6gHPt9Q97W8CKB2gLrdAOMWYe8=w544-h544-l90-rj", videoIds: ["LwTakkn8dfU", "1BoXlv-TV2c"] },
    { title: "Man Next Door", artist: "Massive Attack, Horace Andy", coverLink: "https://file.garden/aNtAfG887DiA_7lO/2012LBM/mnd.jpg", videoIds: ["OgrTSszC-qs"] },
    { title: "Comedown", artist: "Bush", coverLink: "https://i.discogs.com/fkX7a4SWtGV3w7dg0SLYgMj-9TzKaEgi1MY42OHiq8Q/rs:fit/g:sm/q:90/h:470/w:532/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIwMDQ4/NjItMTQ3OTM1NTY3/NC04NjkyLmpwZWc.jpeg", videoIds: ["jGw1EFFqIl4"] },
    { title: "Ever (Foreign Flag)", artist: "Team Sleep", coverLink: "https://i.discogs.com/c_Wz-Zb_nOa8uZIq9z2bFf5C0fwkKd7-YVHu4duokh0/rs:fit/g:sm/q:90/h:470/w:527/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ5MDMw/MzYtMTU1OTg3NDc1/MC00OTkyLmpwZWc.jpeg", videoIds: ["IZetWPOAXyA"] },
    { title: "Barely Breathing", artist: "Duncan Sheik", coverLink: "https://i.discogs.com/1LpOfNDFABaRoGdGkh9JeFZCFzJSaKULadxbL0C2zR0/rs:fit/g:sm/q:90/h:530/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE3NjA5/NDYtMTI5MTc2Mzcz/Ny5qcGVn.jpeg", videoIds: ["ml2Abds1EIU"] },
    { title: "Cousins", artist: "Vampire Weekend", coverLink: "https://i.discogs.com/_lgtPiJHAqAszFFhqzVTRrO2UsAkcMgZq3hStlarjgs/rs:fit/g:sm/q:90/h:599/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIwNTU2/OTItMTI2MTMxNjUy/My5qcGVn.jpeg", videoIds: ["h5bEGG85PGw"] }, // { title: "Rubberneckin’ (Paul Oakenfold Remix / Radio Edit)", artist: "Elvis Presley", coverLink: "https://lh3.googleusercontent.com/2Y-SnfAN-rZZK__LI_9kgeit_eyDgkF25EDCyfMc8XcOsB51SdCZl-co4OEwMjuB7esIcnmrxpLYZK6n=w544-h544-l90-rj", videoIds: ["to5-5ZrgNw0"] },
    { title: "Sailing On The Seven Seas", artist: "Orchestral Manoeuvres In The Dark", coverLink: "https://i.discogs.com/etfynYpoZx1j4tQMhfsrTKvVDrFkBX5KLxElSD5JY9M/rs:fit/g:sm/q:90/h:526/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTUwNTkw/Ny0xNDY0NTUxODIz/LTMwNTAuanBlZw.jpeg", videoIds: ["6bq3MXx9L78"] },
    { title: "Useless (The Kruder + Dorfmeister Session)", artist: "Depeche Mode", coverLink: "https://i.scdn.co/image/ab67616d0000b273d6107d00a9d49d1edb2bc561", videoIds: ["PY44fUxWpT4"] },
    { title: "Sadeness (Part 1)", artist: "Enigma", coverLink: "https://lh3.googleusercontent.com/kkLjKbkuFJ_0n6yjDnvBxEFKLIJhIazhL9O4ME4vxhQtDD6krmggovVucIsO8A2_XNyV9Jb0P-gw3gA=w544-h544-l90-rj", videoIds: ["tl0jmpkniNk"] },
    { title: "Is This Pain Our Pleasure", artist: "Mint Condition", coverLink: "https://lh3.googleusercontent.com/BPg-Wqp8rDZbVzAz7G-U5NubmB2oHpQr8VjAIERU2beQuDLlUVKrOMf0WYs-39Vx1maQAMJnSK-jw8w=w544-h544-l90-rj", videoIds: ["GnvKRPe7JZo"] }, // { title: "What’s Going On", artist: "Marvin Gaye", coverLink: "https://lh3.googleusercontent.com/wDZ9b8Tk_8QyuTurmJ9N8uZ31xF095slzLLCaEvw_XO_e7tEeKVf0BlGkbuPyIcNRhtWQtQMdkqHC-61=w544-h544-l90-rj", videoIds: ["ApthDWoPMFQ"] },
    { title: "It’s A Man’s Man’s Man’s World", artist: "Seal", coverLink: "https://lh3.googleusercontent.com/V5xDQnI4LMH8syDXFHl4o8pRuzRdWYSHkSiTfW0FHJZwsHi_euzVRiGYQu_NASLFCyR1Lp9GmSVYYLbf=w512-h512-l90-rj", videoIds: ["nOoIB5Z64Jw"] },
    { title: "Whole Lotta Love", artist: "Tina Turner", coverLink: "https://www.the-world-of-tina.com/img/Tina-Turner-Single-Whole-Lotta-Love-Cover-01.jpg", videoIds: ["0xAXkmo-HTI"] },
    { title: "Dirt Off Your Shoulder / Lying From You", artist: "JAY-Z, Linkin Park", coverLink: "https://i.discogs.com/3DZQlz7XNohkggE61-TrRhEiSeI-Mzq_X7JX32jRfwk/rs:fit/g:sm/q:90/h:528/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMwODY5/ODYtMTMxNTA5ODY4/NC5qcGVn.jpeg", videoIds: ["z7rOS9rd4sY"] },
    { title: "I Knew You Were Trouble", artist: "Taylor Swift", coverLink: "https://i.discogs.com/oQv6Eg52QmvLdtMiFjifhbdl5Zv3Kq6o3vBLrkBBT_Y/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ1OTMx/MDgtMTM2OTM2NzEz/Ny0zOTUzLmpwZWc.jpeg", videoIds: ["VmBoTeLsKfs"] }, // { title: "What Goes Around", artist: "Nescobar-a-lop-lop", coverLink: "https://lh3.googleusercontent.com/aSTol_CCYU6f_vdHAOPBejJjXrL93W650PTo3wLVwMyJUcyeopjjDgPRgCSdv5r3hMdbBLx_30_3Qg4fzg=w544-h544-l90-rj", videoIds: ["SUvNGdwkJDA"] },
    { title: "When I Get You Alone", artist: "Robin Thicke", coverLink: "https://i.discogs.com/wfaCvI9JBAyFGcCGO5_NgyIzmlSzHq9HfcVyXGrvCrA/rs:fit/g:sm/q:90/h:595/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTgxMjI1/Mi0xMzQ0MjgxNzAx/LTY2NTYuanBlZw.jpeg", videoIds: ["mxe515cnm4o"] },
    { title: "Something About Us", artist: "Daft Punk", coverLink: "https://lh3.googleusercontent.com/KWKJfEfasVPd53ha--VXKCrjQPtCYMbjtTAg25IhmODgYDud5bqPgZXwzaLY4Mhq1MTEjjvyFRbLSuw=w544-h544-l90-rj", videoIds: ["URzOGF_QGls"] },
    { title: "None But Shining Hours", artist: "The Books", coverLink: "https://lh3.googleusercontent.com/kINhski3VJXxLRxZcgiakS_RqYAZAyHeqwrU2xcMJkBR8uZsKpRwbLHKkiNOPEjb60SYhUzdYNg_E8dp=w544-h544-l90-rj", videoIds: ["iH__pyErwqU"] },
    { title: "Heaven Must Be Like This", artist: "D’Angelo", coverLink: "https://file.garden/aNtAfG887DiA_7lO/2012LBM/dangelo.webp", videoIds: ["JnZku_CzPz4"] },
    { title: "Our Day Will Come", artist: "Amy Winehouse", coverLink: "https://lh3.googleusercontent.com/Tgbr7RbxqVgHFnyU93JEJdqr3SqsUtM-kkOCqIJUgvWhNmaQZvL_sfG1fgz80_Z4QQfGjMNbGDi-Jhw=w544-h544-l90-rj", videoIds: ["qmdDIxQC0Ao"] },
    { title: "Sleeping Satellite (US Alt. Rock Version)", artist: "Tasmin Archer", coverLink: "https://lh3.googleusercontent.com/lTXTpbmKUa8zv_iehpaTYjSa2KjfzvdQCijysmSIfX0NEFGQnuVMCJuXk_8ip7MwUS3eR0djKmlElvzt=w544-h544-l90-rj", videoIds: ["sjNqMP6qPyI"] },
    { title: "Satisfy You", artist: "Puff Daddy, R. Kelly", coverLink: "https://i.discogs.com/edknC-fIKzCeri2Ofjz_CrY9nPbgqry7WthbcIRrAD0/rs:fit/g:sm/q:90/h:593/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIwMTU4/MTQtMTQ1NDE2MjMy/Mi02Njk1LmpwZWc.jpeg", videoIds: ["6EsSSAXBXAI"] },
    { title: "Get Involved", artist: "Raphael Saadiq, Q-Tip", coverLink: "https://i.discogs.com/0vF2inL1Mpk_yC7qSbaxPrJ-2bp1Ly84zvFnIiysGo4/rs:fit/g:sm/q:90/h:524/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTc5MjY1/OC0xNjg4ODE0NzE2/LTUxMTcuanBlZw.jpeg", videoIds: ["qQhe8Vehi40"] },
    { title: "If You Could Save Yourself (You’d Save Us All)", artist: "Ween", coverLink: "https://lh3.googleusercontent.com/oPN7dH-oUeMApWhWVHiwuB1zdywet_YiiHSd62BZ0q7Zkfm6tF90Tw5IATYt0B1or7NuDlUHdqBbrC4n=w544-h544-l90-rj", videoIds: ["XRc8GI3MX_Q"] },
    { title: "Get It On", artist: "Natural Born Hippies", coverLink: "https://i.discogs.com/1cvsQq3BFsCaO4ZpTLB_pT2sRCRraFClVVWdcEFpMYk/rs:fit/g:sm/q:90/h:599/w:599/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ2ODQ1/MTYtMTM3MjE2MTk1/NC01NDQxLmpwZWc.jpeg", videoIds: ["CddMvYslYDU"] },
    { title: "Big Area", artist: "Then Jerico", coverLink: "https://lh3.googleusercontent.com/k5L_2USXltuDWoB2C51oDbpbFane95ytK6154iyneTm_Gsogalpm4jD4W_HwGESewadubx_nSfuuAhc=w544-h544-l90-rj", videoIds: ["R7BSdl3ei0w"] } // { title: "People Get Ready", artist: "The Impressions", coverLink: "https://i.scdn.co/image/ab67616d0000b2737dd29630ee8d2efc01dd28da", videoIds: ["UG-KNy1MRTc"] }
  ];
  const ALT_PLAYLIST = [
    {
      title: "Handshake Drugs",
      artist: "Wilco",
      coverLink: "https://lh3.googleusercontent.com/4jji1ZbpUA972P-THkTUhqSHzBMaDYac9WfdknzynIUSHq9vBt3c_hAIcx25hfoTzCdOPouq6oPsUfHI=w512-h512-s-l90-rj",
      videoIds: ["HUv7fcLYN0Q", "1WdaqKmvW54"]
    },
    {
      title: "City of Blinding Lights",
      artist: "U2",
      coverLink: "https://lh3.googleusercontent.com/oGD5OqEmUIFFMP-qP8lyH5sDy13R2LI52NEl82c7qjdeKyoieWQUJh56Cx2wYoLNgxaOBB2cPwRoj3Cj=w544-h544-l90-rj",
      videoIds: ["udwMPDmvxGw", "fh7BJ1ylbJw", "Fg4MfA3BCyI"]
    },
	{
      title: "Disparate Youth",
      artist: "Santigold",
      coverLink: "https://i.scdn.co/image/ab67616d0000b27381a3294d8cb52667c8701e6f",
      videoIds: ["l44f3N0pfA0", "GTVSe5eYOio"]
    },
    {
      title: "Codex",
      artist: "Radiohead",
      coverLink: "https://i.discogs.com/7pT_t1xLRoc29d-0d_hxif8D5Gd8l7FsVlqc3G8RYy0/rs:fit/g:sm/q:90/h:533/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI4MzA3/NzktMTQxMDY2MDc5/NC0yMzY3LmpwZWc.jpeg",
      videoIds: ["T7t38uDUg5E", "Av5k8GShKyE"]
    },
    {
      title: "Afraid of Everyone",
      artist: "The National",
      coverLink: "https://i.discogs.com/eyw00VHOwsknmsJNSC9sRsZNLg-d8FZ-6e95_D4Yp7Q/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIyNjU3/ODMtMTU4Njk2MDc2/OS0zMjA1LmpwZWc.jpeg",
      videoIds: ["2ZPsJWw-A98", "4_yskRDrmqI"]
    },
    {
      title: "Limit to Your Love",
      artist: "James Blake",
      coverLink: "https://i.discogs.com/FrA0vsBKo4L05utlTeWHwiIshQcgeXL9EwKIO2NSqxw/rs:fit/g:sm/q:90/h:333/w:333/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI1NjYw/NTYtMTI5MDgwMjYw/Ni5qcGVn.jpeg",
      videoIds: ["GBt2sRjX3Zk", "0e-THl1oPcs", "QqEuI2HBBWM"]
    },
    {
      title: "Going To A Town",
      artist: "George Michael",
      coverLink: "https://i.discogs.com/kF3FMHMLtBsJaJoj3JqYc5Eru6llMw_urTeSzCZ952Y/rs:fit/g:sm/q:90/h:600/w:598/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTU2MTAx/MDUtMTU0Njg3OTU3/OC01MzIxLmpwZWc.jpeg",
      videoIds: ["A2Mf8vM4NQc", "8DZJQjn3jV8"]
    },
    {
      title: "Written in Reverse",
      artist: "Spoon",
      coverLink: "https://i.discogs.com/7Ii-LxnF40tDFNlRoMr3magEKITTDvvD-R2zJmDtvQk/rs:fit/g:sm/q:90/h:600/w:596/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIxMDkz/NzEtMTI2NDY0NjM5/MS5qcGVn.jpeg",
      videoIds: ["tRN4_jQrkVE", "7TOoC3KpHZQ"]
    },
    {
      title: "Atlas Air",
      artist: "Massive Attack",
      coverLink: "https://i.discogs.com/PK354bQxAVOc4rmEfGCuDm_xAlXygw9d9u3fQBiwGNA/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI1NTk3/OTktMTQ3MzE4OTA5/My0zMzQ2LmpwZWc.jpeg",
      videoIds: ["kpywvNjt090", "BkXls8jnNfI", "CC6UIyBO5pE"]
    },
    {
      title: "I Can Change",
      artist: "LCD Soundsystem",
      coverLink: "https://i.discogs.com/5-ki7XmgLXpf7GZLOygn-PVQ4vumrRq6wkWj6eWol88/rs:fit/g:sm/q:90/h:460/w:460/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIzODI1/OTItMTUwMTA5MDUx/NS03NDEyLmpwZWc.jpeg",
      videoIds: ["V7QaGc2fmmE", "tW8FKkVnqng"]
    },
    {
      title: "Leif Erikson",
      artist: "Interpol",
      coverLink: "https://i.discogs.com/cb-XJykN52nfs-88tQ3UFN_Ru8PthbeC1SdpNsyW0UI/rs:fit/g:sm/q:90/h:596/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM5OTEx/NC0xNDY0MzIwMDE0/LTk4OTMuanBlZw.jpeg",
      videoIds: ["SRFa9N4fGtc", "jEHvFHw90DY"]
    },
    {
      title: "The Words That Maketh Murder",
      artist: "PJ Harvey",
      coverLink: "https://lh3.googleusercontent.com/M_fasC5WxphX7UQ5Et7L6bWD7oxEEp-uQbMje4lMpP93Kbw2cdbGamac-fXdKKBTH2gcxwdXlpjgTUZpvg=w544-h544-l90-rj",
      videoIds: ["U4E6sbyIee0", "vRKjKknyh7o"]
    },
    {
      title: "Open Arms",
      artist: "Elbow",
      coverLink: "https://i.discogs.com/73gxuBVvqXbLr7rXOlXgaxq_UG4dNi_t_brpbLITSF4/rs:fit/g:sm/q:90/h:350/w:350/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI4Nzc1/MzYtMTMwNTI3Mzk3/Ny5qcGVn.jpeg",
      videoIds: ["nf8N4KfLHGQ", "G-AxBOtHzEI"]
    },
    {
      title: "Infinity",
      artist: "The xx",
      coverLink: "https://lh3.googleusercontent.com/gaC74efJpReccPqiVS1D1mvu_7DOR1xZ1CSw5JbmTMDsdkVtCdx3nSgTN1DP90wHrKKryfjAO1J4nea7TQ=w544-h544-l90-rj",
      videoIds: ["8EIJB_zHw94", "UwFHFYVXojU"]
    },
    {
      title: "Wave",
      artist: "Beck",
      coverLink: "https://lh3.googleusercontent.com/aIYnooOgxTKPLd3KuATaK-MVCW2sI5jKmO24INE7b3s9848x10T7ZAmM9K4yhwr9Xv3FuMWPOGX2dX7v9g=w544-h544-l90-rj",
      videoIds: ["uiZ3NVUVW98", "m2DLZkv4Yvg"]
    },
    {
      title: "Yet Again",
      artist: "Grizzly Bear",
      coverLink: "https://i.discogs.com/DuzAf0YubV4P3Jp_dzh1EScxTWaIlwyOKl4Nb2czcT8/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQyMDE0/MDItMTM1ODM4MDM1/NS05ODE0LmpwZWc.jpeg",
      videoIds: ["6nNBR-au2PQ", "bteY_fs3Y18"]
    },
    {
      title: "Ég anda",
      artist: "Sigur Rós",
      coverLink: "https://lh3.googleusercontent.com/S8yuT62t5KFQHwx5dzO3oYOj2mY2gMuANdm3FiRFeENRLAP_F7qZpRO6B1JOg4CnsR5f9Ikt30hgDLo=w544-h544-l90-rj",
      videoIds: ["Hhxlvf0N6H0", "sMLaKb32QyE"]
    },

  ];
  let PLAYLISTS_DATA = [];

  // constants
  const PLAYER_ELEMENT_ID = "nice-music-player";
  const PLAYLIST_SELECTOR_ID = "player-playlist-selector";
  const YOUTUBE_PLAYER_DIV_ID = "youtube-player-container";
  const TITLE_ID = "player-title";
  const ARTIST_ID = "player-artist";
  const CONTROLS_CONTAINER_ID = "player-controls-container";
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

  // persistence key
  const STORAGE_KEY = 'nice-music-player-state-v1';

  // icons
  const ICON_PLAY = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%23f0f0f0'%3E%3Cpath d='M7.5 5v14l11-7z'/%3E%3C/svg%3E";
  const ICON_PAUSE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%23f0f0f0'%3E%3Cpath d='M6 19h4V5H6v14zm8-14v14h4V5h-4z'/%3E%3C/svg%3E";
  const ICON_PREV = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%23f0f0f0'%3E%3Cpath d='M6 6h2v12H6zm3.5 6l8.5 6V6z'/%3E%3C/svg%3E";
  const ICON_NEXT = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%23f0f0f0'%3E%3Cpath d='M16 6h2v12h-2zm-1.5 6l-8.5 6V6z'/%3E%3C/svg%3E";
  const ICON_VOLUME = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%23f0f0f0'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E";
  const ICON_MUTED = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%23f0f0f0'%3E%3Cpath d='M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'/%3E%3C/svg%3E";
  const ICON_REPEAT_NONE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%23f0f0f0'%3E%3Cpath d='M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z'/%3E%3C/svg%3E";
  const ICON_REPEAT_ALL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%2366b3ff'%3E%3Cpath d='M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z'/%3E%3C/svg%3E";
  const ICON_REPEAT_ONE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%2366b3ff'%3E%3Cpath d='M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z'/%3E%3Cpath d='M12.5 15H11v-1.4l1.5-0.6v-3H11V9h3v6h-1.5z'/%3E%3C/svg%3E";
  const ICON_SHUFFLE_OFF = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' viewBox='0 0 24 24' fill='%23f0f0f0'%3E%3Cpath d='M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z'/%3E%3C/svg%3E";
  const ICON_SHUFFLE_ON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' viewBox='0 0 24 24' fill='%2366b3ff'%3E%3Cpath d='M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z'/%3E%3C/svg%3E";
  const ICON_HEART_EMPTY = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='%23f0f0f0' stroke-width='2'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E";
  const ICON_HEART_FULL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='%23ff4b4b'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E";
  const FAVORITE_BUTTON_ID = "player-favorite-button";

  class Song {
    constructor(title, artist, coverLink, videoIds) {
      this.title = title;
      this.artist = artist;
      this.coverLink = coverLink;
      this.videoIds = Array.isArray(videoIds) ? videoIds : [videoIds];
      this.currentVideoIndex = 0;
    }
    getTitle() { return this.title; }
    getArtist() { return this.artist; }
    getCoverLink() { return this.coverLink; }

    getVideoId() {
      return this.videoIds.length > 0 ? this.videoIds[this.currentVideoIndex] : null;
    }

    containsVideoId(id) {
      return this.videoIds.includes(id);
    }

    tryNextVideo() {
      if (this.currentVideoIndex < this.videoIds.length - 1) {
        this.currentVideoIndex++;
        return true;
      }
      return false;
    }

    resetVideoIndex() {
      this.currentVideoIndex = 0;
    }
  }

  class Playlist {
    constructor(songs = []) { this.songs = songs; this.currentSongIndex = 0; }
    getCurrentSong() { return this.songs.length > 0 ? this.songs[this.currentSongIndex] : null; }
    playNext() { if (this.songs.length > 0) this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length; }
    playPrevious() { if (this.songs.length > 0) this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length; }
    setCurrentSongIndex(index) { if (index >= 0 && index < this.songs.length) this.currentSongIndex = index; else console.warn(`Invalid song index: ${index}`); }
    isEmpty() { return this.songs.length === 0; }
    getSongs() { return this.songs; }
    setSongs(newSongs) { this.songs = newSongs; this.id = Date.now() + Math.random().toString(36); }
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
  let hasUserInitiatedPlayback = true;

  // persisted state + apply mute at onReady
  let persistedState = null;
  let applyMuteOnReady = false;

  const TARGET_FPS = 30;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;
  let lastRafUpdateTime = 0;
  let playerShouldBeUpdatingWhenVisible = false;

  // keep a smoothed progress value to avoid early jank
  let lastProgress = 0;
  // throttle resize
  let resizeRaf = 0;

  let pendingSeekTime = null;
  let seekSettlingTime = 0;

  let dragRaf = 0;
  let pendingIndex = null;

  let playerContainer, playlistSelectorElement, titleElement, artistElement;
  let controlsContainer, playPauseButton, prevButtonElement, nextButtonElement;
  let progressBar, currentTimeElement, durationElement;
  let volumeContainer, volumeIconElement, volumePercentageElement, volumeSlider;
  let repeatButtonElement, shuffleButtonElement;
  let queueContainerElement, queueTitleElement, queueListElement, queueToggleButton;

  let progressFillElement, progressBufferElement, progressThumbElement;
  let progressBarContainerElement;
  let cachedProgressBarWidth = 0;
  let progressBarObserver = null;
  
  function injectYouTubeAPI() {
	  if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) return;
	  const tag = document.createElement('script');
	  tag.src = "https://www.youtube.com/iframe_api";
	  tag.async = true;
	  const firstScriptTag = document.getElementsByTagName('script')[0];
	  if (firstScriptTag && firstScriptTag.parentNode) {
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	  } else {
		document.head.appendChild(tag);
	  }
	}
	injectYouTubeAPI();

  function injectResourceHints() {
    if (document.getElementById('yt-preconnect')) return;

    const hints = [
      'https://www.youtube.com',
      'https://i.ytimg.com',
      'https://s.ytimg.com'
    ];

    const frag = document.createDocumentFragment();
    hints.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      frag.appendChild(link);
    });

    // ID to prevent double injection
    const marker = document.createElement('meta');
    marker.id = 'yt-preconnect';
    frag.appendChild(marker);

    document.head.appendChild(frag);
  }

  injectResourceHints();

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

  // persistence helpers
  let cachedState = null;

  function loadState() {
    if (cachedState) return cachedState;
    try {
      cachedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return cachedState;
    } catch { return {}; }
  }
  function saveState(patch = {}) {
    cachedState = { ...cachedState, ...patch };

    if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(() => {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedState)); } catch {}
        }, { timeout: 2000 });
    } else {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedState)); } catch {}
    }
}
  cachedState = loadState();

  function persistCurrentSong() {
    if (!playlist) return;
    const s = playlist.getCurrentSong();
    if (s) saveState({ currentVideoId: s.getVideoId() });
  }

  let lastUIState = {
    songId: null,
    playerState: null,
    playlistIndex: null
  };

  function updateSongMetadataOnly() {
    if (!playlist) return;
    const song = playlist.getCurrentSong();

    if (!song) {
      titleElement.textContent = "No song loaded";
      artistElement.textContent = "";
      return;
    }

    const title = song.title || "";
    const artist = song.artist || "";

    if (titleElement.textContent !== title) titleElement.textContent = title;
    if (artistElement.textContent !== artist) artistElement.textContent = artist;
  }

  function updateGlobalControls() {
    if (playerReady) updateVolumeIcon();
    updateRepeatButtonUI();
    updateShuffleButtonUI();
    if (playlistSelectorElement) playlistSelectorElement.value = activePlaylistIndex.toString();
  }

  function updateUI() {
    updateSongMetadataOnly();

    const state = (playerReady && ytPlayer && typeof ytPlayer.getPlayerState === 'function')
      ? ytPlayer.getPlayerState()
      : null;

    if (state !== null) {
      if (playPauseButton) updatePlayPauseButton(state !== YT.PlayerState.PLAYING && state !== YT.PlayerState.BUFFERING);
      updateDurationDisplay();
    } else {
      if (playPauseButton) updatePlayPauseButton(true);
      if (durationElement) durationElement.textContent = "--:--";
    }

    updateGlobalControls();
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

  function scheduleDragRender(nextIndex) {
    pendingIndex = nextIndex;
    if (dragRaf) return;

    dragRaf = requestAnimationFrame(() => {
      dragRaf = 0;
      if (pendingIndex === null) return;

      // only update if the index has actually changed
      if (pendingIndex !== playlist.currentSongIndex) {
        playlist.setCurrentSongIndex(pendingIndex);
        updateCoverFlow();
        updateSongMetadataOnly();
      }
      pendingIndex = null;
    });
  }

  function updateCoverFlow(fractionalOffset = 0) {
    if (!poolItems.length) return;

    const songs = playlist.getSongs();
    const totalSongs = songs.length;
    const currentIndex = playlist.currentSongIndex;

    const visualCenter = currentIndex + fractionalOffset;
    const halfPool = Math.floor(POOL_SIZE / 2);
    const startRenderIndex = Math.floor(visualCenter) - halfPool;

    const SPREAD = 180;
    const ROTATION = 55;
    const SCALE_SIDE = 0.85;
    const SCALE_CENTER = 1.2;

    const DEPTH_OFFSET = 100;

    for (let i = 0; i < POOL_SIZE; i++) {
      const songIndex = startRenderIndex + i;
      const poolIndex = ((songIndex % POOL_SIZE) + POOL_SIZE) % POOL_SIZE;
      const item = poolItems[poolIndex];

      if (songIndex < 0 || songIndex >= totalSongs) {
        item.style.visibility = 'hidden';
        item.style.opacity = '0';
		item.classList.remove('has-reflection');

        poolAllocation[poolIndex] = -1;
        item.dataset.allocatedSongIndex = "-1";
        continue;
      }

      if (poolAllocation[poolIndex] !== songIndex) {
        item.style.backgroundImage = `url("${songs[songIndex].getCoverLink()}")`;

        poolAllocation[poolIndex] = songIndex;
        item.dataset.allocatedSongIndex = String(songIndex);

        item.style.visibility = 'visible';
      }

      const realOffset = (songIndex - currentIndex) - fractionalOffset;
      const absOffset = Math.abs(realOffset);
      const sign = Math.sign(realOffset);

      const xPos = realOffset * SPREAD;

      const zPos = -absOffset * DEPTH_OFFSET;

      const rotationProgress = Math.min(1, absOffset);
      const rotation = -sign * rotationProgress * ROTATION;

      const scaleProgress = Math.max(0, 1 - absOffset);
      const scale = SCALE_SIDE + (scaleProgress * (SCALE_CENTER - SCALE_SIDE));

	  item.style.transform = `translate3d(${xPos}px, 0, ${zPos}px) rotateY(${rotation}deg) scale(${scale})`;
	  
	  item.classList.toggle('has-reflection', absOffset <= 2);

      let opacity = '1';
      if (absOffset > 3) opacity = '0';
      else if (absOffset > 2) opacity = '0.4';
      else if (absOffset > 1) opacity = '0.7';
      else if (absOffset > 0.5) opacity = '0.9';

      if (absOffset > 4.5) {
        item.style.visibility = 'hidden';
        item.style.opacity = '0';
      } else {
        item.style.visibility = 'visible';
        item.style.opacity = opacity;
      }
    }
  }
  
	function createCoverFlowPool() {
		const coverFlowContainer = document.getElementById('cover-flow-container');
		if (!coverFlowContainer || poolItems.length > 0) return; // already created

		const frag = document.createDocumentFragment();

		for (let i = 0; i < POOL_SIZE; i++) {
			const item = document.createElement('div');
			item.className = 'cover-flow-item';
			item.dataset.allocatedSongIndex = "-1";

			item.addEventListener('click', (e) => {
				if (isDragging) return;
				const index = parseInt(e.currentTarget.dataset.allocatedSongIndex, 10);
				if (!isNaN(index) && index >= 0 && index !== playlist.currentSongIndex) {
					playlist.setCurrentSongIndex(index);
					loadCurrentSong(true);
				}
			});

			frag.appendChild(item);
			poolItems.push(item);
			poolAllocation[i] = -1;
		}

		coverFlowContainer.appendChild(frag);
	}
	
	function resetCoverFlow() {
		// invalidate all pool slots
		for (let i = 0; i < POOL_SIZE; i++) {
			poolAllocation[i] = -1;
			if (poolItems[i]) {
				poolItems[i].dataset.allocatedSongIndex = "-1";
				poolItems[i].style.backgroundImage = '';
				poolItems[i].style.visibility = 'hidden';
				poolItems[i].style.opacity = '0';
			}
		}

		updateCoverFlow(0);
	}

  const POOL_SIZE = 15;
  let poolItems = [];
  const poolAllocation = new Array(POOL_SIZE).fill(-1);
  const preloadedUrls = new Set();

  // cover preloader
  function preloadCovers(songs) {
    if (!songs || !songs.length) return;

    // preload current + nearby (e.g., ±5 songs)
    const preloadRange = 5;
    const currentIdx = playlist.currentSongIndex;
    const start = Math.max(0, currentIdx - preloadRange);
    const end = Math.min(songs.length, currentIdx + preloadRange + 1);

	const load = () => {
		const frag = document.createDocumentFragment();
		for (let i = start; i < end; i++) {
		  const url = songs[i].getCoverLink();
		  if (preloadedUrls.has(url)) continue;
		  
		  preloadedUrls.add(url);
		  const link = document.createElement('link');
		  link.rel = 'preload';
		  link.as = 'image';
		  link.href = url;
		  link.fetchPriority = 'low';
		  frag.appendChild(link);
		}
		document.head.appendChild(frag);
	  };

    if (typeof window.requestIdleCallback === 'function') {
      requestIdleCallback(load, { timeout: 1000 });
    } else {
      setTimeout(load, 0);
    }
  }

  function loadCurrentSong(autoplay = false, isRetry = false) {
    cachedDuration = 0;
    pendingSeekTime = null;
    seekSettlingTime = 0;

    const currentSong = playlist?.getCurrentSong();

    // if this is a fresh load (not a retry due to error), reset to the first videoId
    if (!isRetry && currentSong) {
      currentSong.resetVideoIndex();
    }
    stopRafUpdater();

    requestAnimationFrame(() => {
      // reset progress UI + smoothing accumulator
      if (progressBar) {
        progressBar.value = 0;
        progressBar.style.setProperty('--progress-percent', '0%');
        progressBar.style.setProperty('--buffer-percent', '0%');
      }
      lastProgress = 0;

      if (currentTimeElement) currentTimeElement.textContent = "0:00";
      if (durationElement) durationElement.textContent = "--:--";

      updateUI();
      updateCoverFlow();
    });

    if (!playerReady || !ytPlayer?.loadVideoById) {
      if (playPauseButton) updatePlayPauseButton(true);
      return;
    }
    if (!currentSong) {
      if (ytPlayer?.stopVideo) ytPlayer.stopVideo();
      if (playPauseButton) updatePlayPauseButton(true);
      return;
    }

    // get the active video ID
    const videoIdToLoad = currentSong.getVideoId();
    if (!videoIdToLoad) {
      console.error(`No video ID found for "${currentSong.getTitle()}".`);
      return;
    }

    // cue when not autoplaying, load when autoplaying
    const cfg = { videoId: videoIdToLoad, startSeconds: 0, suggestedQuality: 'small' };
    if (autoplay) ytPlayer.loadVideoById(cfg);
    else ytPlayer.cueVideoById(cfg);

    window._musicPlayerAutoplayIntent = autoplay;
    persistCurrentSong();

    updateFavoriteButtonUI();
  }

  function loadNewPlaylistByIndex(newPlaylistIndex) {
    if (newPlaylistIndex < 0 || newPlaylistIndex >= PLAYLISTS_DATA.length) return;
    activePlaylistIndex = newPlaylistIndex;
    saveState({ activePlaylistIndex });
    const selectedPlaylistData = PLAYLISTS_DATA[activePlaylistIndex];
    stopRafUpdater();
    const newSongs = selectedPlaylistData.songs.map(d => new Song(d.title, d.artist, d.coverLink, d.videoIds || d.videoId));
    originalSongOrderForCurrentPlaylist = [...newSongs];
    playlist.setSongs(isShuffleActive ? shuffleArray(newSongs) : newSongs);
    playlist.setCurrentSongIndex(0);

    // update queue title with playlist name
    if (queueTitleElement) queueTitleElement.innerHTML = `Up Next — ${selectedPlaylistData.name}`;

    // force queue rebuild
    lastQueuePlaylistId = null;

    // reset cover flow
    resetCoverFlow();

    preloadCovers(playlist.getSongs());

    const wasPlaying = playerReady && ytPlayer && typeof ytPlayer.getPlayerState === 'function' && ytPlayer.getPlayerState() === YT.PlayerState.PLAYING;
    loadCurrentSong(wasPlaying);
  }

  function togglePlayPause() {
    if (!playerReady || !ytPlayer?.getPlayerState) return;
    if (!hasUserInitiatedPlayback) {
      if (playlist.isEmpty()) return;
      hasUserInitiatedPlayback = true;
      loadCurrentSong(true);
    } else {
      const state = ytPlayer.getPlayerState();
      if (state === YT.PlayerState.PLAYING) ytPlayer.pauseVideo();
      else ytPlayer.playVideo();
    }
  }

  function updatePlayPauseButton(isPaused) {
    if (!playPauseButton) return;

    if (!playPauseButton._imgCache) {
      playPauseButton._imgCache = playPauseButton.querySelector('img');
    }
    const img = playPauseButton._imgCache;
	
	const newState = isPaused ? 'paused' : 'playing';
    
    if (playPauseButton.dataset.state === newState) return;
    playPauseButton.dataset.state = newState;

    const label = isPaused ? "Play" : "Pause";

    if (img) {
      img.src = isPaused ? ICON_PLAY : ICON_PAUSE;
      img.alt = "";
    }
    
    playPauseButton.setAttribute('aria-label', label);
    playPauseButton.title = label;
  }

  let cachedDuration = 0;
  let lastRenderedPercent = null;
  let lastRenderedBuffer = null;
  let lastRenderedSecond = null;
  let lastBufferCheckTime = 0;

  function rafUpdateProgress(timestamp) {
    if (!isUpdaterRunning) return;

    if (!playerReady || !ytPlayer?.getCurrentTime || !hasUserInitiatedPlayback) {
      stopRafUpdater();
      return;
    }
    if (isSeeking) {
      rafId = requestAnimationFrame(rafUpdateProgress);
      return;
    }

    // FPS throttling
    const elapsed = timestamp - lastRafUpdateTime;
    if (elapsed < FRAME_INTERVAL) {
      rafId = requestAnimationFrame(rafUpdateProgress);
      return;
    }
    lastRafUpdateTime = timestamp - (elapsed % FRAME_INTERVAL);

    let currentTime = ytPlayer.getCurrentTime();

    // handle pending seek
    if (pendingSeekTime !== null) {
      const timeDiff = Math.abs(currentTime - pendingSeekTime);
      if (timeDiff < 0.5) {
        pendingSeekTime = null;
        seekSettlingTime = 0;
      } else if (seekSettlingTime < 500) {
        currentTime = pendingSeekTime;
        seekSettlingTime += elapsed;
      } else {
        pendingSeekTime = null;
        seekSettlingTime = 0;
      }
    }

    // cache duration
    if (!cachedDuration || cachedDuration === 0) {
      cachedDuration = ytPlayer.getDuration();
    }
    const duration = cachedDuration;

    if (duration && isFinite(duration) && duration > 0) {
      const targetProgress = (currentTime / duration) * 100;

      // smoothing logic
      if (pendingSeekTime !== null) {
        lastProgress = targetProgress;
      } else {
        const smoothingFactor = 0.3;
        lastProgress += (targetProgress - lastProgress) * smoothingFactor;
        if (Math.abs(targetProgress - lastProgress) < 0.01) {
          lastProgress = targetProgress;
        }
      }

      const p = Math.max(0, Math.min(100, lastProgress));

      // calculate buffer
      let bufferPercent = lastRenderedBuffer || 0;
      if (timestamp - lastBufferCheckTime > 500) {
        const loaded = ytPlayer.getVideoLoadedFraction?.() || 0;
        bufferPercent = Math.max(0, Math.min(100, loaded * 100));
        lastRenderedBuffer = bufferPercent;
        lastBufferCheckTime = timestamp;
      }

      updateProgressVisuals(p, bufferPercent);

      // text update
	  const currentSecond = Math.floor(currentTime);
		if (lastRenderedSecond !== currentSecond) {
		  if (currentTimeElement) currentTimeElement.textContent = formatTime(currentTime);
		  
		  // update invisible input
		  if (progressBar && document.activeElement === progressBar) {
			progressBar.setAttribute('aria-valuenow', p.toFixed(2));
		  }
		  
		  lastRenderedSecond = currentSecond;
		}
	  
    }

    if (isUpdaterRunning) {
      rafId = requestAnimationFrame(rafUpdateProgress);
    }
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

    // apply restored volume/mute
    setVolumeFromSlider(false);
    if (applyMuteOnReady && typeof ytPlayer.mute === 'function') ytPlayer.mute();

    // don't load song - just update UI to show first song's metadata
    updateUI();

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

    // ensure hasUserInitiatedPlayback is true if we get any meaningful state change after initial load
    if (state !== YT.PlayerState.UNSTARTED && state !== -1) {
      // if a video is cued or playing, it implies some form of initiation or readiness
    }

    updateDurationDisplay();

    switch (state) {
      case YT.PlayerState.PLAYING:
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

        if (!hasUserInitiatedPlayback) { // should not happen.
          updateUI(); // just update UI, don't proceed to next song
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
        stopRafUpdater();
        if (progressBar) { progressBar.value = 0; progressBar.style.setProperty('--progress-percent', '0%'); }
        if (currentTimeElement) currentTimeElement.textContent = "0:00";
        updateUI();

        if (window._musicPlayerAutoplayIntent === true) {
          ytPlayer.playVideo();
        }
        break;
      case YT.PlayerState.UNSTARTED:
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
    console.error(`YouTube Player error: ${errorMsg}`);

    const currentSong = playlist?.getCurrentSong();

    // if the error is recoverable (e.g., video blocked), try the next available video ID
    if (currentSong && recoverableErrorCodes.includes(event.data)) {
      console.log(`Video failed for "${currentSong.getTitle()}". Checking for alternatives...`);
      // attempt to switch to the next videoId in the array
      if (currentSong.tryNextVideo()) {
        console.log(`Found an alternative. Attempting to play video ID: ${currentSong.getVideoId()}`);
        // reload the song with the next video ID. isRetry=true prevents resetting the video index back to 0
        loadCurrentSong(window._musicPlayerAutoplayIntent, true);
        return; // stop further error processing (skipping) for this event
      } else {
        console.warn(`No more alternative videos for "${currentSong.getTitle()}".`);
      }
    }

    // skip to next song
    updatePlayPauseButton(true); stopRafUpdater();
    if (titleElement) titleElement.textContent = "Error";
    if (artistElement) artistElement.textContent = "Could not load video.";

    // auto-skip problematic video after brief delay
    setTimeout(() => {
      if (!playlist || playlist.isEmpty()) return;
      const wasPlaying = true;
      playlist.playNext();
      loadCurrentSong(wasPlaying);
    }, 1000);
  }

  function setVolumeFromSlider(shouldUnmute = true) {
    if (!volumeSlider || !volumePercentageElement) return;
    const volumeValue = parseFloat(volumeSlider.value);
    const newVolumePercent = Math.round(volumeValue * 100);
	
    volumeSlider.style.setProperty('--volume-percent', `${newVolumePercent}%`);

    if (playerReady && ytPlayer && typeof ytPlayer.setVolume === 'function') {
      ytPlayer.setVolume(newVolumePercent);
      // if user drags slider up from 0, it should unmute the player.
      if (shouldUnmute && newVolumePercent > 0 && typeof ytPlayer.isMuted === 'function' && ytPlayer.isMuted()) {
        ytPlayer.unMute();
      }
      // if user drags to 0, it should mute the player.
      if (newVolumePercent === 0 && typeof ytPlayer.mute === 'function' && !ytPlayer.isMuted()) {
        ytPlayer.mute();
      }
    }

    volumePercentageElement.textContent = `${newVolumePercent}%`;
    if (volumeSlider) volumeSlider.setAttribute('aria-valuenow', String(newVolumePercent));
    updateVolumeIcon();
  }
  function toggleMute() {
    if (!playerReady || !ytPlayer || !volumeSlider || !volumeIconElement) return;

    const isCurrentlyMuted = ytPlayer.isMuted();

    if (isCurrentlyMuted) {
      ytPlayer.unMute();

      const restoreVolume = (volumeBeforeMute > 0) ? volumeBeforeMute : 0.5;

      ytPlayer.setVolume(restoreVolume * 100);

      volumeSlider.value = restoreVolume;
	  volumeSlider.style.setProperty('--volume-percent', `${Math.round(restoreVolume * 100)}%`);
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
	  volumeSlider.style.setProperty('--volume-percent', '0%');
      if (volumePercentageElement) {
        volumePercentageElement.textContent = `0%`;
      }

      volumeIconElement.src = ICON_MUTED;
      volumeIconElement.alt = "Unmute";
      volumeIconElement.title = "Unmute";
    }

    // persist
    saveState({
      volume: parseFloat(volumeSlider.value),
      muted: ytPlayer ? ytPlayer.isMuted() : (parseFloat(volumeSlider.value) === 0)
    });
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
    const modes = ['none', 'all', 'one'];
    repeatMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    debouncedSaveState({ repeatMode });
    updateRepeatButtonUI();
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
    saveState({ shuffle: isShuffleActive });

    const currentSongBeforeToggle = playlist.getCurrentSong();

    if (isShuffleActive) {
      const shuffledSongs = shuffleArray(originalSongOrderForCurrentPlaylist);
      playlist.setSongs(shuffledSongs);
    } else {
      playlist.setSongs([...originalSongOrderForCurrentPlaylist]);
    }

    if (currentSongBeforeToggle) {
      const newIndex = playlist.getSongs().findIndex(song => song.containsVideoId(currentSongBeforeToggle.getVideoId()));
      playlist.setCurrentSongIndex(newIndex !== -1 ? newIndex : 0);
    } else {
      playlist.setCurrentSongIndex(0);
    }

    lastQueuePlaylistId = null;

    // reset cover flow
	resetCoverFlow();

    preloadCovers(playlist.getSongs());

    updateCoverFlow();
    updateUI();

    persistCurrentSong();
  }
  let lastQueuePlaylistId = null;
  let lastActiveQueueIndex = -1;
  
  const queueItemTemplate = document.createElement('template');
  queueItemTemplate.innerHTML = `
    <li class="${PLAYER_QUEUE_ITEM_CLASS}" role="option">
        <span class="player-queue-item-title"></span>
        <span class="player-queue-item-artist"></span>
    </li>
  `;

  let queueItemCache = [];

  let dragSrcEl = null;
  
  function createQueueItem() {
    return queueItemTemplate.content.firstElementChild.cloneNode(true);
  }

  function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    this.classList.add('dragging');
  }

  function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    return false;
  }

  function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();

    if (dragSrcEl !== this) {
      const fromIndex = parseInt(dragSrcEl.dataset.index);
      const toIndex = parseInt(this.dataset.index);

      const movedItem = userFavorites.splice(fromIndex, 1)[0];
      userFavorites.splice(toIndex, 0, movedItem);

      saveFavorites();

      if (PLAYLISTS_DATA[activePlaylistIndex].isFavorites) {
        playlist.setSongs([...userFavorites]);
        if (fromIndex === playlist.currentSongIndex) {
          playlist.currentSongIndex = toIndex;
        } else {
          const currentSong = originalSongOrderForCurrentPlaylist[playlist.currentSongIndex];
          const newIdx = userFavorites.indexOf(currentSong);
          if (newIdx !== -1) playlist.currentSongIndex = newIdx;
        }
      }

      lastQueuePlaylistId = null;
      updateQueueDisplay();
    }
    return false;
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
  }

  function updateQueueDisplay() {
    if (!queueListElement || !playlist) return;

    if (playlist.isEmpty()) {
	  const emptyItem = document.createElement('li');
	  emptyItem.className = `${PLAYER_QUEUE_ITEM_CLASS} player-queue-empty`;
	  emptyItem.textContent = 'Queue is empty';
	  queueListElement.replaceChildren(emptyItem);
	  
      lastQueuePlaylistId = null;
      lastActiveQueueIndex = -1;
      return;
    }

    const songs = playlist.getSongs();
    const currentIndex = playlist.currentSongIndex;

    // use a randomized ID
    const playlistId = playlist.id;
    const playlistChanged = lastQueuePlaylistId !== playlistId;

    // if playlist hasn't changed, just swap the class on the specific elements
    if (!playlistChanged) {
      if (lastActiveQueueIndex !== currentIndex) {
        if (lastActiveQueueIndex !== -1 && queueItemCache[lastActiveQueueIndex]) {
          queueItemCache[lastActiveQueueIndex].classList.remove('current');
        }
        if (queueItemCache[currentIndex]) {
          queueItemCache[currentIndex].classList.add('current');
        }
        lastActiveQueueIndex = currentIndex;
      }
      return;
    }

    lastQueuePlaylistId = playlistId;
    lastActiveQueueIndex = currentIndex;

    queueItemCache = [];
    const frag = document.createDocumentFragment();

    const isFavPlaylist = PLAYLISTS_DATA[activePlaylistIndex] && PLAYLISTS_DATA[activePlaylistIndex].isFavorites;

    songs.forEach((song, index) => {
      const li = createQueueItem();
	  const children = li.children;
      li.title = `${song.getTitle()} — ${song.getArtist()}`;
      li.dataset.index = String(index);

	  children[0].textContent = song.getTitle();
      children[1].textContent = ` - ${song.getArtist()}`;

      if (index === currentIndex) li.classList.add('current');

      if (isFavPlaylist) {
        li.draggable = true;
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);
      }

      frag.appendChild(li);
      queueItemCache.push(li);
    });

    queueListElement.replaceChildren(frag);
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

  function updateProgressVisuals(percentage, bufferPercentage = 0) {
    if (!progressFillElement || !progressThumbElement) return;

    const ratio = Math.max(0, Math.min(1, percentage / 100));
    progressFillElement.style.transform = `scaleX(${ratio})`;

    if (progressBufferElement && bufferPercentage > 0) {
      const bufferRatio = Math.max(0, Math.min(1, bufferPercentage / 100));
      progressBufferElement.style.transform = `scaleX(${bufferRatio})`;
    }

    const px = cachedProgressBarWidth * ratio;
    progressThumbElement.style.transform = `translate3d(${px}px, 0, 0)`;
  }

  function createPlayerElements() {
    const fragment = document.createDocumentFragment();
    playerContainer = document.createElement("div"); playerContainer.id = PLAYER_ELEMENT_ID; playerContainer.tabIndex = 0; fragment.appendChild(playerContainer);
    const coverFlowStage = document.createElement('div'); coverFlowStage.id = 'cover-flow-stage';
    const coverFlowContainer = document.createElement('div'); coverFlowContainer.id = 'cover-flow-container';
    coverFlowStage.appendChild(coverFlowContainer); playerContainer.appendChild(coverFlowStage);
    queueContainerElement = document.createElement("div"); queueContainerElement.id = QUEUE_CONTAINER_ID; queueContainerElement.classList.add('hidden');
    queueTitleElement = document.createElement("h4"); queueTitleElement.id = QUEUE_TITLE_ID; queueTitleElement.innerHTML = `Up Next`; queueContainerElement.appendChild(queueTitleElement);
    queueListElement = document.createElement("ul"); queueListElement.id = QUEUE_LIST_ID; queueListElement.setAttribute('role', 'listbox'); queueContainerElement.appendChild(queueListElement); playerContainer.appendChild(queueContainerElement);
    const controlsWrapper = document.createElement("div"); controlsWrapper.id = "player-controls-wrapper";
    const songInfoContainer = document.createElement("div"); songInfoContainer.id = "cover-flow-song-info";
    // live region for SRs
    songInfoContainer.setAttribute('role', 'status'); songInfoContainer.setAttribute('aria-live', 'polite');
    titleElement = document.createElement("h3"); titleElement.id = TITLE_ID; songInfoContainer.appendChild(titleElement);
    artistElement = document.createElement("p"); artistElement.id = ARTIST_ID; songInfoContainer.appendChild(artistElement); controlsWrapper.appendChild(songInfoContainer);
    controlsContainer = document.createElement("div"); controlsContainer.id = CONTROLS_CONTAINER_ID;
    const progressBarContainer = document.createElement("div"); progressBarContainer.id = PROGRESS_BAR_CONTAINER_ID;
    currentTimeElement = document.createElement("span"); currentTimeElement.id = CURRENT_TIME_ID; progressBarContainer.appendChild(currentTimeElement);

    const progressWrapper = document.createElement("div");
    progressWrapper.id = "progress-visual-wrapper";

    const visualTrack = document.createElement("div");
    visualTrack.className = "progress-visual-track";

    progressBufferElement = document.createElement("div");
    progressBufferElement.className = "progress-buffer-bar";
    visualTrack.appendChild(progressBufferElement);

    progressFillElement = document.createElement("div");
    progressFillElement.className = "progress-fill-bar";
    visualTrack.appendChild(progressFillElement);

    progressWrapper.appendChild(visualTrack);

    progressThumbElement = document.createElement("div");
    progressThumbElement.className = "progress-thumb";
    progressWrapper.appendChild(progressThumbElement);

    progressBar = document.createElement("input");
    progressBar.type = "range";
    progressBar.id = PROGRESS_BAR_ID;
    progressBar.className = "transparent-seeker";
    progressBar.min = 0;
    progressBar.max = 100;
    progressBar.step = 0.01;
    progressBar.setAttribute('aria-label', 'Seek');
    progressWrapper.appendChild(progressBar);

    progressBarContainer.appendChild(progressWrapper);

    durationElement = document.createElement("span"); durationElement.id = DURATION_ID; progressBarContainer.appendChild(durationElement);
    controlsContainer.appendChild(progressBarContainer);
    const bottomControls = document.createElement('div'); bottomControls.id = 'player-bottom-controls';
    volumeContainer = document.createElement("div"); volumeContainer.id = VOLUME_CONTAINER_ID;
    volumeIconElement = document.createElement("img"); volumeIconElement.id = VOLUME_ICON_ID; volumeIconElement.src = ICON_VOLUME; volumeContainer.appendChild(volumeIconElement);
    volumeSlider = document.createElement("input"); volumeSlider.type = "range"; volumeSlider.id = VOLUME_SLIDER_ID; volumeSlider.min = 0; volumeSlider.max = 1; volumeSlider.step = 0.01; volumeSlider.value = 0.5; volumeContainer.appendChild(volumeSlider);
    volumePercentageElement = document.createElement("span"); volumePercentageElement.id = VOLUME_PERCENTAGE_ID; volumePercentageElement.textContent = "50%"; volumeContainer.appendChild(volumePercentageElement); // visible immediately
    shuffleButtonElement = document.createElement("button"); shuffleButtonElement.id = SHUFFLE_BUTTON_ID; shuffleButtonElement.classList.add(PLAYER_CONTROL_BUTTON_CLASS, 'extra-control');
    const shuffleIcon = document.createElement("img"); shuffleIcon.src = ICON_SHUFFLE_OFF; shuffleButtonElement.appendChild(shuffleIcon); volumeContainer.appendChild(shuffleButtonElement);
    repeatButtonElement = document.createElement("button"); repeatButtonElement.id = REPEAT_BUTTON_ID; repeatButtonElement.classList.add(PLAYER_CONTROL_BUTTON_CLASS, 'extra-control');
    const repeatIcon = document.createElement("img"); repeatIcon.src = ICON_REPEAT_NONE; repeatButtonElement.appendChild(repeatIcon); volumeContainer.appendChild(repeatButtonElement);
    bottomControls.appendChild(volumeContainer);
    const mainControlsCenter = document.createElement('div'); mainControlsCenter.id = 'player-main-controls-center';
    prevButtonElement = document.createElement("button"); prevButtonElement.id = PREV_BUTTON_ID; prevButtonElement.classList.add(PLAYER_CONTROL_BUTTON_CLASS);
    const prevIcon = document.createElement("img"); prevIcon.src = ICON_PREV; prevButtonElement.appendChild(prevIcon); mainControlsCenter.appendChild(prevButtonElement);
    playPauseButton = document.createElement("button"); playPauseButton.id = PLAY_PAUSE_BUTTON_ID; playPauseButton.classList.add(PLAYER_CONTROL_BUTTON_CLASS);
    const playPauseIcon = document.createElement("img"); playPauseIcon.src = ICON_PLAY; playPauseButton.appendChild(playPauseIcon); mainControlsCenter.appendChild(playPauseButton);
    nextButtonElement = document.createElement("button"); nextButtonElement.id = NEXT_BUTTON_ID; nextButtonElement.classList.add(PLAYER_CONTROL_BUTTON_CLASS);
    const nextIcon = document.createElement("img"); nextIcon.src = ICON_NEXT; nextButtonElement.appendChild(nextIcon); mainControlsCenter.appendChild(nextButtonElement); bottomControls.appendChild(mainControlsCenter);

    const extraControlsRight = document.createElement('div'); extraControlsRight.id = 'player-extra-controls-right';

    const favoriteButton = document.createElement("button");
    favoriteButton.id = FAVORITE_BUTTON_ID;
    favoriteButton.classList.add(PLAYER_CONTROL_BUTTON_CLASS, 'extra-control');
    favoriteButton.innerHTML = `<img src="${ICON_HEART_EMPTY}" alt="Favorite">`;
    extraControlsRight.appendChild(favoriteButton);

    playlistSelectorElement = document.createElement("select"); playlistSelectorElement.id = PLAYLIST_SELECTOR_ID; extraControlsRight.appendChild(playlistSelectorElement);
    queueToggleButton = document.createElement('button'); queueToggleButton.id = QUEUE_TOGGLE_ICON_ID; queueToggleButton.classList.add(PLAYER_CONTROL_BUTTON_CLASS, 'extra-control'); queueToggleButton.innerHTML = '<span>≡</span>'; queueToggleButton.title = "Show/Hide Queue"; extraControlsRight.appendChild(queueToggleButton);
    bottomControls.appendChild(extraControlsRight);

    controlsContainer.appendChild(bottomControls);
    controlsWrapper.appendChild(controlsContainer);
    playerContainer.appendChild(controlsWrapper);
    const youtubePlayerDiv = document.createElement("div"); youtubePlayerDiv.id = YOUTUBE_PLAYER_DIV_ID; fragment.appendChild(youtubePlayerDiv);
    return fragment;
  }

  let userFavorites = [];

  function loadFavorites() {
    const state = loadState();
    if (state.favorites) {
      userFavorites = state.favorites.map(s => new Song(s.title, s.artist, s.coverLink, s.videoIds));
    }
  }

  function saveFavorites() {
    saveState({ favorites: userFavorites });
    updateFavoritesPlaylistEntry();
  }

  function updateFavoritesPlaylistEntry() {
    let favIndex = PLAYLISTS_DATA.findIndex(p => p.isFavorites);
    if (favIndex === -1) {
      PLAYLISTS_DATA.push({ name: "My favorites", songs: userFavorites, isFavorites: true });
    } else {
      PLAYLISTS_DATA[favIndex].songs = userFavorites;
    }
  }

  function toggleFavorite() {
    const currentSong = playlist.getCurrentSong();
    if (!currentSong) return;

    const index = userFavorites.findIndex(s => s.getTitle() === currentSong.getTitle());

    if (index === -1) {
      userFavorites.push(currentSong);
    } else {
      userFavorites.splice(index, 1);
    }

    saveFavorites();
    updateFavoriteButtonUI();

    // of we are currently viewing the Favorites playlist, we need to refresh the queue
    if (PLAYLISTS_DATA[activePlaylistIndex].isFavorites) {
      lastQueuePlaylistId = null;
      updateQueueDisplay();
    }
  }

  function updateFavoriteButtonUI() {
    const btn = document.getElementById(FAVORITE_BUTTON_ID);
    if (!btn) return;
    const currentSong = playlist.getCurrentSong();
    const isLiked = currentSong && userFavorites.some(s => s.getTitle() === currentSong.getTitle());

    btn.querySelector('img').src = isLiked ? ICON_HEART_FULL : ICON_HEART_EMPTY;
    btn.title = isLiked ? "Remove from favorites" : "Add to favorites";
  }

  // debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
  const debouncedSaveState = debounce((patch) => {
    saveState(patch);
  }, 500);

  let isDragging = false, startX, dragStartIndex;
  function bindUIEventListeners() {
    if (!playPauseButton || !nextButtonElement || !prevButtonElement || !repeatButtonElement || !shuffleButtonElement || !progressBar || !volumeIconElement || !volumeSlider || !playlistSelectorElement || !queueToggleButton) {
      console.error("Failed to bind listeners: A core UI element is missing."); return;
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
        playlist?.playNext();
        loadCurrentSong(wasPlaying);
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
        playlist?.playPrevious();
        loadCurrentSong(wasPlaying);
      }
    });
    repeatButtonElement.addEventListener("click", toggleRepeatMode);
    shuffleButtonElement.addEventListener("click", toggleShuffleMode);
    volumeIconElement.addEventListener("click", toggleMute);

    // persist queue visibility
    queueToggleButton.addEventListener('click', () => {
      queueContainerElement.classList.toggle('hidden');
      saveState({ queueVisible: !queueContainerElement.classList.contains('hidden') });
    });

    // delegate queue item clicks
    queueListElement.addEventListener('click', (e) => {
      const li = e.target && e.target.closest ? e.target.closest('li') : null;
      if (!li || !queueListElement.contains(li)) return;
      const index = Number(li.dataset.index);
      if (!Number.isInteger(index)) return;
      playlist.setCurrentSongIndex(index);
      loadCurrentSong(true);
    });

    // coverFlowStage event handlers
    const coverFlowStage = document.getElementById('cover-flow-stage');
    coverFlowStage.addEventListener('mousedown', (e) => { isDragging = true; startX = e.pageX; dragStartIndex = playlist.currentSongIndex; coverFlowStage.style.cursor = 'grabbing'; });
    const stopDragging = () => {
      if (!isDragging) return;
      isDragging = false;
      coverFlowStage.style.cursor = 'grab';

      // if we ended on the same song we started with, don't reload
      if (dragStartIndex === playlist.currentSongIndex) {
        togglePlayPause();
      } else {
        // different song, load it
        const wasPlaying = playerReady && ytPlayer?.getPlayerState() === YT.PlayerState.PLAYING;
        loadCurrentSong(wasPlaying);
      }
    };
    coverFlowStage.addEventListener('mouseleave', stopDragging);
    coverFlowStage.addEventListener('mouseup', stopDragging);
    coverFlowStage.addEventListener('mousemove', (e) => {
      if (!isDragging) return; e.preventDefault();
      const walk = (e.pageX - startX) * -0.005;
      const newIndex = Math.round(dragStartIndex + walk);
      const clampedIndex = Math.max(0, Math.min(playlist.getSongs().length - 1, newIndex));
      scheduleDragRender(clampedIndex);
    });

    // wheel to navigate - always prevent page scroll when over the player
    let wheelLocked = false;
    coverFlowStage.addEventListener('wheel', (e) => {
      // prevent page scroll when hovering over cover flow
      e.preventDefault();
      e.stopPropagation();

      if (!playlist || playlist.isEmpty() || wheelLocked) return;

      // check if we can actually change songs
      const canGoNext = e.deltaY > 0 && playlist.currentSongIndex < playlist.getSongs().length - 1;
      const canGoPrev = e.deltaY < 0 && playlist.currentSongIndex > 0;

      // only change songs if we can
      if (canGoNext || canGoPrev) {
        wheelLocked = true;
        setTimeout(() => { wheelLocked = false; }, 300);

        const wasPlaying = playerReady && ytPlayer?.getPlayerState() === YT.PlayerState.PLAYING;
        if (canGoNext) playlist.playNext();
        else if (canGoPrev) playlist.playPrevious();
        loadCurrentSong(wasPlaying);
      }
    }, { passive: false });

    coverFlowStage.addEventListener('dblclick', () => togglePlayPause());
    document.getElementById(FAVORITE_BUTTON_ID).addEventListener("click", toggleFavorite);

    // touch swipe support for cover-flow
    coverFlowStage.addEventListener('touchstart', (e) => {
      if (!playlist || playlist.isEmpty()) return;
      const t = e.touches[0];
      isDragging = true;
      startX = t.pageX;
      dragStartIndex = playlist.currentSongIndex;
      coverFlowStage.style.cursor = 'grabbing';
    }, { passive: true });
    coverFlowStage.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const t = e.touches[0];
      const walk = (t.pageX - startX) * -0.005;
      const newIndex = Math.round(dragStartIndex + walk);
      const clampedIndex = Math.max(0, Math.min(playlist.getSongs().length - 1, newIndex));
      scheduleDragRender(clampedIndex);
    }, { passive: false });
    coverFlowStage.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      coverFlowStage.style.cursor = 'grab';
      const wasPlaying = playerReady && ytPlayer?.getPlayerState() === YT.PlayerState.PLAYING;
      loadCurrentSong(wasPlaying);
    });

    const progressWrapper = document.getElementById('progress-visual-wrapper');
    if (progressWrapper) {
      progressBarObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          cachedProgressBarWidth = entry.contentRect.width;
          updateProgressVisuals(parseFloat(progressBar.value) || 0);
        }
      });
      progressBarObserver.observe(progressWrapper);
    }

    // make seeking deterministic on click/drag
    progressBar.addEventListener('mousedown', () => {
      if (!hasUserInitiatedPlayback) return;
      isSeeking = true;
      stopRafUpdater();
    });
    progressBar.addEventListener('touchstart', () => {
      if (!hasUserInitiatedPlayback) return;
      isSeeking = true;
      stopRafUpdater();
    }, { passive: true });


    progressBar.addEventListener("input", () => {
      if (!isSeeking || !hasUserInitiatedPlayback) return;
      const percentage = progressBar.value;

      updateProgressVisuals(percentage);

      // keep CSS fill locked to the thumb value to avoid drift
      progressBar.style.setProperty('--progress-percent', `${percentage}%`);
      if (playerReady && ytPlayer && typeof ytPlayer.getDuration === 'function' && currentTimeElement) {
        const duration = ytPlayer.getDuration();
        if (duration && isFinite(duration)) {
          currentTimeElement.textContent = formatTime((percentage / 100) * duration);
        }
      }
      progressBar.setAttribute('aria-valuenow', String(progressBar.value));
    });

    const applySeekFromProgressBar = () => {
      if (!hasUserInitiatedPlayback) { isSeeking = false; return; }
      if (!playerReady || !ytPlayer || typeof ytPlayer.getDuration !== 'function' || typeof ytPlayer.seekTo !== 'function') {
        isSeeking = false; return;
      }
      const duration = ytPlayer.getDuration();
      if (!duration || !isFinite(duration) || duration <= 0) { isSeeking = false; return; }

      const seekTime = (progressBar.value / 100) * duration;

      // set pending seek time to prevent visual jumping
      pendingSeekTime = seekTime;
      seekSettlingTime = 0;

      ytPlayer.seekTo(seekTime, true);
      if (currentTimeElement) currentTimeElement.textContent = formatTime(seekTime);

      isSeeking = false;
      const state = ytPlayer.getPlayerState();
      if (state === YT.PlayerState.PLAYING) startRafUpdater();
      else stopRafUpdater();
    };

    // click anywhere on the track to jump accurately
    progressBar.addEventListener('click', (e) => {
      if (!hasUserInitiatedPlayback) return;
      const rect = progressBar.getBoundingClientRect();
      const x = (e.clientX ?? 0);
      const ratio = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      progressBar.value = (ratio * 100).toFixed(2);
      progressBar.style.setProperty('--progress-percent', `${progressBar.value}%`);
      applySeekFromProgressBar();
    });

    progressBar.addEventListener("change", applySeekFromProgressBar);

    const handleSeekEnd = () => { if (!isSeeking) return; applySeekFromProgressBar(); };
    progressBar.addEventListener("mouseup", handleSeekEnd);
    progressBar.addEventListener("touchend", handleSeekEnd);

    volumeSlider.addEventListener("input", () => {
      setVolumeFromSlider(true);
      updateVolumeIcon();
      debouncedSaveState({
        volume: parseFloat(volumeSlider.value),
        muted: playerReady && ytPlayer && typeof ytPlayer.isMuted === 'function' ? ytPlayer.isMuted() : false
      });
    });
    playlistSelectorElement.addEventListener("change", (event) => loadNewPlaylistByIndex(parseInt(event.target.value, 10)));

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      const tag = (document.activeElement && document.activeElement.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || document.activeElement?.isContentEditable) return;

      const isPlayerActive = document.activeElement === playerContainer || playerContainer.contains(document.activeElement);
      if (!isPlayerActive) return;

      switch (e.key) {
        case ' ': e.preventDefault(); togglePlayPause(); break;
        case 'ArrowRight': {
          if (!playerReady || !ytPlayer || !hasUserInitiatedPlayback) return;
          e.preventDefault();
          const jump = e.shiftKey ? 10 : 5;
          const t = Math.min((ytPlayer.getCurrentTime() || 0) + jump, ytPlayer.getDuration() || Infinity);
          if (isFinite(t)) ytPlayer.seekTo(t, true);
          break;
        }
        case 'ArrowLeft': {
          if (!playerReady || !ytPlayer || !hasUserInitiatedPlayback) return;
          e.preventDefault();
          const jump = e.shiftKey ? 10 : 5;
          const t = Math.max((ytPlayer.getCurrentTime() || 0) - jump, 0);
          ytPlayer.seekTo(t, true);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (!volumeSlider) return;
          volumeSlider.value = String(Math.min(1, parseFloat(volumeSlider.value) + 0.05));
		  volumeSlider.style.setProperty('--volume-percent', `${Math.round(parseFloat(volumeSlider.value) * 100)}%`);
          setVolumeFromSlider(true);
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          if (!volumeSlider) return;
          volumeSlider.value = String(Math.max(0, parseFloat(volumeSlider.value) - 0.05));
		  volumeSlider.style.setProperty('--volume-percent', `${Math.round(parseFloat(volumeSlider.value) * 100)}%`);
          setVolumeFromSlider(true);
          break;
        }
        case 'm': case 'M': toggleMute(); break;
        case 's': case 'S': toggleShuffleMode(); break;
        case 'r': case 'R': toggleRepeatMode(); break;
        case 'q': case 'Q':
          queueContainerElement.classList.toggle('hidden');
          saveState({ queueVisible: !queueContainerElement.classList.contains('hidden') });
          break;
        case '1': case '2': case '3':
          loadNewPlaylistByIndex(parseInt(e.key, 10) - 1);
          break;
        case 'k': case 'K': e.preventDefault(); togglePlayPause(); break;
        case 'j': case 'J': {
          if (!playerReady || !ytPlayer || !hasUserInitiatedPlayback) return;
          e.preventDefault();
          const t = Math.max((ytPlayer.getCurrentTime() || 0) - 10, 0);
          ytPlayer.seekTo(t, true);
          break;
        }
        case 'l': case 'L': {
          if (!playerReady || !ytPlayer || !hasUserInitiatedPlayback) return;
          e.preventDefault();
          const t = Math.min((ytPlayer.getCurrentTime() || 0) + 10, ytPlayer.getDuration() || Infinity);
          if (isFinite(t)) ytPlayer.seekTo(t, true);
          break;
        }
        case 'n': case 'N': {
          e.preventDefault();
          const wasPlaying = playerReady && ytPlayer?.getPlayerState() === YT.PlayerState.PLAYING;
          playlist?.playNext();
          loadCurrentSong(wasPlaying);
          break;
        }
        case 'p': case 'P': {
          e.preventDefault();
          const wasPlaying = playerReady && ytPlayer?.getPlayerState() === YT.PlayerState.PLAYING;
          playlist?.playPrevious();
          loadCurrentSong(wasPlaying);
          break;
        }
        case 'Home': {
          if (!playerReady || !ytPlayer || !hasUserInitiatedPlayback) return;
          e.preventDefault();
          ytPlayer.seekTo(0, true);
          break;
        }
        case 'End': {
          if (!playerReady || !ytPlayer || !hasUserInitiatedPlayback) return;
          e.preventDefault();
          const d = ytPlayer.getDuration();
          if (isFinite(d)) ytPlayer.seekTo(d - 0.25, true);
          break;
        }
        default: break;
      }
    });

    // keep CF transforms fresh
    window.addEventListener('resize', () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        updateCoverFlow();
      });
    });
  }
  
  const playerSheet = new CSSStyleSheet();

  function injectPlayerStyles() {
    if (document.adoptedStyleSheets.includes(playerSheet)) return;

    playerSheet.replaceSync(`
            :root {
                --cover-size: 250px; --player-bg: #141414; --control-bar-bg: rgba(28, 28, 28, 0.85);
                --text-primary: #f0f0f0; --text-secondary: #a0a0a0; --slider-track-bg: #444;
                --progress-fill-bg: #f0f0f0; --slider-thumb-bg: #e0e0e0;
                --font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                --transition-speed: 0.5s; --transition-func: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                --buffer-percent: 0%; --volume-fill-bg: rgba(240, 240, 240, 0.45);
            }
            #${PLAYER_ELEMENT_ID} { display: flex; flex-direction: column; background-color: var(--player-bg); width: 100%; height: 450px; overflow: hidden; position: relative; font-family: var(--font-family); border-radius: 0 0 .4em .4em; contain: content; }
			#cover-flow-stage {
				flex-grow: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				cursor: grab;
				-webkit-user-select: none;
				user-select: none;
				padding-bottom: 40px;
				overflow: hidden;
				touch-action: pan-y;
			}

			#cover-flow-container {
				position: relative;
				width: 100%;
				height: var(--cover-size);
				transform-style: preserve-3d;
				perspective: 1200px;
				display: flex;
				justify-content: center;
				align-items: center;
				top: -42px;
			}

			.cover-flow-item {
				position: absolute;
				width: var(--cover-size);
				height: var(--cover-size);
				aspect-ratio: 1 / 1;
				border-radius: 6px;
				border: 1px solid rgba(255,255,255,0.1);
				box-shadow:
					0 10px 30px rgba(0,0,0,0.5),
					0 20px 60px rgba(0,0,0,0.3);
				background-color: #1a1a1a;
				pointer-events: none;
				transition:
					transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
					opacity 0.5s ease,
					filter 0.5s ease;
				will-change: transform, opacity;
				backface-visibility: hidden;
				transform-origin: center center;
				background-size: cover;
				background-position: center;
			    background-repeat: no-repeat;
			}
            .cover-flow-item.has-reflection::after {
				content: '';
				position: absolute;
				top: calc(100% + 5px);
				left: 0;
				width: 100%;
				height: 60%;

				background: inherit;
				background-size: cover;
				background-position: center;

				transform: scaleY(-1);

				-webkit-mask-image: linear-gradient(
					to bottom,
					rgba(0,0,0,0.4) 0%,
					rgba(0,0,0,0.1) 65%,
					transparent 100%
				);
				mask-image: linear-gradient(
					to bottom,
					rgba(0,0,0,0.4) 0%,
					rgba(0,0,0,0.1) 65%,
					transparent 100%
				);
			}
			.cover-flow-item.has-reflection::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: linear-gradient(
					135deg,
					rgba(255,255,255,0.1) 0%,
					transparent 50%
				);
				border-radius: 6px;
				pointer-events: none;
				z-index: 1;
			}
			#cover-flow-stage.dragging .cover-flow-item {
				transition-duration: 0.1s;
			}
			.cover-flow-item.loading {
				background: linear-gradient(
					135deg,
					#2a2a2a 0%,
					#3a3a3a 50%,
					#2a2a2a 100%
				);
				background-size: 200% 200%;
				animation: shimmer 2s ease-in-out infinite;
			}

			@keyframes shimmer {
				0% { background-position: 0% 0%; }
				50% { background-position: 100% 100%; }
				100% { background-position: 0% 0%; }
			}
            #player-controls-wrapper { position: absolute; bottom: 0; left: 0; right: 0; height: 125px; background: rgba(28, 28, 28, 0.96); /*-webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);*/ border-top: 1px solid rgba(255, 255, 255, 0.15); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5px 20px; box-sizing: border-box; }
            #cover-flow-song-info { color: var(--text-primary); text-align: center; margin-bottom: 5px; text-shadow: 0 1px 3px rgba(0,0,0,0.6); }
            #${TITLE_ID} { font-size: 16px; font-weight: 500; margin: 0; }
            #${ARTIST_ID} { font-size: 14px; color: var(--text-secondary); margin: 0; }
            #${CONTROLS_CONTAINER_ID} { width: 100%; max-width: 800px; display: flex; flex-direction: column; align-items: center; }
            #${PROGRESS_BAR_CONTAINER_ID} {
				width: 100%;
				display: flex;
				align-items: center;
				gap: 10px;
				order: 1;
				margin-bottom: 10px;
				height: 20px;
				/* transform: translate3d(0, 0, 0); */
			}

			#${CURRENT_TIME_ID}, #${DURATION_ID} {
				font-size: 11px;
				color: var(--text-secondary);
				min-width: 35px;
				text-align: center;
				flex-shrink: 0;
				font-variant-numeric: tabular-nums;
				letter-spacing: 0.3px;
			}

			#nice-music-player input[type="range"] {
				-webkit-appearance: none;
				appearance: none;
				background: transparent;
				cursor: pointer;
				width: 100%;
				outline: none;
				flex-grow: 1
				flex-shrink: 1;
			}
            #nice-music-player input[type="range"]::-webkit-slider-runnable-track { height: 5px; background: var(--slider-track-bg); border-radius: 5px; }
            #nice-music-player input[type="range"]::-moz-range-track { height: 5px; background: var(--slider-track-bg); border-radius: 5px; }
            #${PROGRESS_BAR_ID}::-webkit-slider-runnable-track {
                background: linear-gradient(
                    to right,
                    var(--progress-fill-bg) 0%,
                    var(--progress-fill-bg) var(--progress-percent, 0%),
                    rgba(240,240,240,0.35) var(--progress-percent, 0%),
                    rgba(240,240,240,0.35) var(--buffer-percent, 0%),
                    var(--slider-track-bg) var(--buffer-percent, 0%),
                    var(--slider-track-bg) 100%
                );
            }
            #${PROGRESS_BAR_ID}::-moz-range-track {
                background: linear-gradient(
                    to right,
                    var(--progress-fill-bg) 0%,
                    var(--progress-fill-bg) var(--progress-percent, 0%),
                    rgba(240,240,240,0.35) var(--progress-percent, 0%),
                    rgba(240,240,240,0.35) var(--buffer-percent, 0%),
                    var(--slider-track-bg) var(--buffer-percent, 0%),
                    var(--slider-track-bg) 100%
                );
            }
            #nice-music-player input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; margin-top: -5px; height: 15px; width: 15px; background-color: var(--slider-thumb-bg); border-radius: 50%; border: none; }
            #nice-music-player input[type="range"]::-moz-range-thumb { height: 15px; width: 15px; background-color: var(--slider-thumb-bg); border-radius: 50%; border: none; }
            #player-bottom-controls { display: flex; align-items: center; justify-content: space-between; width: 100%; order: 2; }
            #player-main-controls-center { flex: 1; display: flex; align-items: center; justify-content: center; gap: 20px; }
            #${VOLUME_CONTAINER_ID} { flex: 1; display: flex; align-items: center; justify-content: flex-start; gap: 8px; }
			#${VOLUME_ICON_ID}, #${QUEUE_TOGGLE_ICON_ID} {
				transition: opacity 0.2s ease, transform 0.2s ease;
				opacity: 0.8;
			}
			#${VOLUME_ICON_ID}:hover, #${QUEUE_TOGGLE_ICON_ID}:hover {
				opacity: 1;
				transform: scale(1.1);
			}
            #${VOLUME_ICON_ID} { width: 18px; height: 18px; cursor: pointer; }
            #${VOLUME_SLIDER_ID} { width: 140px; }
            #${VOLUME_PERCENTAGE_ID} { font-size: 11px; color: var(--text-secondary); min-width: 35px; }
            #${VOLUME_SLIDER_ID}::-webkit-slider-thumb { height: 12px; width: 12px; margin-top: -3.5px; }
            #${VOLUME_SLIDER_ID}::-moz-range-thumb { height: 12px; width: 12px; }
			#${VOLUME_SLIDER_ID}::-webkit-slider-runnable-track {
				background: linear-gradient(
					to right,
					var(--volume-fill-bg) 0%,
					var(--volume-fill-bg) var(--volume-percent, 50%),
					var(--slider-track-bg) var(--volume-percent, 50%),
					var(--slider-track-bg) 100%
				) !important;
			}
			#${VOLUME_SLIDER_ID}::-moz-range-track {
				background: linear-gradient(
					to right,
					var(--volume-fill-bg) 0%,
					var(--volume-fill-bg) var(--volume-percent, 50%),
					var(--slider-track-bg) var(--volume-percent, 50%),
					var(--slider-track-bg) 100%
				) !important;
			}
            #player-extra-controls-right { flex: 1; display: flex; align-items: center; justify-content: flex-end; gap: 15px; }
            .${PLAYER_CONTROL_BUTTON_CLASS} { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.8; transition: opacity 0.2s ease, transform 0.2s ease; }
            .${PLAYER_CONTROL_BUTTON_CLASS}:hover { background: #1b263b; opacity: 1; transform: scale(1.05); }
            .${PLAYER_CONTROL_BUTTON_CLASS}:active { transform: scale(0.95); }
            .${PLAYER_CONTROL_BUTTON_CLASS} img { display: block; }
            .${PLAYER_CONTROL_BUTTON_CLASS}.extra-control img { width: 18px; height: 18px; }
			.${PLAYER_CONTROL_BUTTON_CLASS} {
				box-shadow: 0 2px 4px rgba(0,0,0,0.2);
				transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
			}
			.${PLAYER_CONTROL_BUTTON_CLASS}:hover {
				box-shadow: 0 4px 8px rgba(0,0,0,0.3);
			}
			.${PLAYER_CONTROL_BUTTON_CLASS}:active {
				box-shadow: 0 1px 2px rgba(0,0,0,0.2);
			}
            #${PREV_BUTTON_ID} img, #${NEXT_BUTTON_ID} img { width: 24px; height: 24px; }
            #${PLAY_PAUSE_BUTTON_ID} img { width: 32px; height: 32px; }
            .${PLAYER_CONTROL_BUTTON_CLASS}.active img { filter: invert(70%) sepia(98%) saturate(1485%) hue-rotate(180deg) brightness(101%) contrast(101%); }
            #${PLAYLIST_SELECTOR_ID} { background: rgba(17, 17, 17, 0.75); color: var(--text-primary); border: 1px solid #555; border-radius: 4px; padding: 4px 8px; font-size: 12px; }
            #${QUEUE_TOGGLE_ICON_ID} { font-size: 24px; line-height: 0; color: #f0f0f0; padding: 11px 4px 11px 5px; }
            #${QUEUE_CONTAINER_ID} { position: absolute; bottom: 155px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 600px; max-height: 180px; background-color: rgba(30, 30, 30, 0.95); border: 1px solid #555; border-radius: 6px; z-index: 1000; padding: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.5); transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease; }
            #${QUEUE_CONTAINER_ID}.hidden { opacity: 0; visibility: hidden; transform: translateX(-50%) scale(0.95); }
            #${QUEUE_TITLE_ID} { font-size: 14px; color: var(--text-primary); margin: 0 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid #444; }
            #${QUEUE_LIST_ID} { list-style: none; padding: 0; margin: 0; max-height: 140px; overflow-y: auto; overscroll-behavior: contain; color: var(--text-secondary); }
			#${QUEUE_LIST_ID} {
				scroll-behavior: smooth;
				scrollbar-width: thin;
				scrollbar-color: rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.3);
			}

			#${QUEUE_LIST_ID}::-webkit-scrollbar {
				width: 8px;
			}

			#${QUEUE_LIST_ID}::-webkit-scrollbar-track {
				background: rgba(0, 0, 0, 0.3);
				border-radius: 4px;
			}

			#${QUEUE_LIST_ID}::-webkit-scrollbar-thumb {
				background: rgba(255, 255, 255, 0.2);
				border-radius: 4px;
				border: 2px solid transparent;
				background-clip: padding-box;
			}

			#${QUEUE_LIST_ID}::-webkit-scrollbar-thumb:hover {
				background: rgba(255, 255, 255, 0.35);
				background-clip: padding-box;
			}

			#${QUEUE_LIST_ID}::-webkit-scrollbar-thumb:active {
				background: rgba(255, 255, 255, 0.5);
				background-clip: padding-box;
			}
            .${PLAYER_QUEUE_ITEM_CLASS} { padding: 5px; font-size: 13px; border-radius: 3px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: background-color 0.2s; }
            .${PLAYER_QUEUE_ITEM_CLASS}:hover { background-color: rgba(255,255,255,0.1); }
            .${PLAYER_QUEUE_ITEM_CLASS}.current { background-color: rgba(102, 179, 255, 0.3); font-weight: bold; }
            .player-queue-item-title { color: #eee; } .player-queue-item-artist { color: #999; }
            #${YOUTUBE_PLAYER_DIV_ID} {
				position: absolute !important;
				top: 0 !important;
				left: 0 !important;
				width: 100% !important; 
				height: 100% !important; 
				opacity: 0 !important;       /* Visually hidden */
				pointer-events: none !important; /* Can't be clicked */
				z-index: -1 !important;      /* Pushed behind your UI */
			}

			#${FAVORITE_BUTTON_ID} img { width: 22px; height: 22px; }
			.player-queue-item.dragging { opacity: 0.5; background: #333; }
			.player-queue-item[draggable="true"] { cursor: grab; }
			.player-queue-item[draggable="true"]:active { cursor: grabbing; }

			@keyframes pulse {
				0%, 100% { opacity: 1; }
				50% { opacity: 0.5; }
			}
			.player-buffering #${TITLE_ID} {
				animation: pulse 1.5s ease-in-out infinite;
			}

			#progress-visual-wrapper {
				position: relative; flex-grow: 1; height: 20px;
				display: flex; align-items: center; cursor: pointer;
			}

			.progress-visual-track {
				position: absolute; left: 0; right: 0; height: 5px;
				background-color: var(--slider-track-bg); border-radius: 5px;
				overflow: hidden; pointer-events: none;
			}

			.progress-buffer-bar, .progress-fill-bar {
				position: absolute; top: 0; left: 0; bottom: 0; width: 100%;
				transform-origin: left center; transform: scaleX(0);
				will-change: transform; pointer-events: none;
			}
			.progress-buffer-bar { background-color: rgba(240,240,240,0.35); }
			.progress-fill-bar { background-color: var(--progress-fill-bg); }

			.progress-thumb {
				position: absolute; left: 0; width: 15px; height: 15px;
				background-color: var(--slider-thumb-bg); border-radius: 50%;
				pointer-events: none; margin-left: -7.5px;
				will-change: transform;
			}

			.transparent-seeker {
				position: absolute; top: 0; left: 0; width: 100%; height: 100%;
				opacity: 0; cursor: pointer; z-index: 10; margin: 0;
			}
			
			/* small focus ring for accessibility */			
            .${PLAYER_CONTROL_BUTTON_CLASS}:focus, #${PLAYLIST_SELECTOR_ID}:focus { outline: 2px solid #66b3ff; outline-offset: 2px; }
			#${PLAYER_ELEMENT_ID}:focus { outline: none; }

            /* @media (max-width: 768px) { #${PLAYER_ELEMENT_ID} { margin: 300px 0 10px 0; } } */
        `);

    document.adoptedStyleSheets = [...document.adoptedStyleSheets, playerSheet];
  }
  
    function loadYouTubeAPI() {
	  return new Promise((resolve) => {
		if (typeof YT !== 'undefined' && typeof YT.Player !== 'undefined') { resolve(); return; }
		window.onYouTubeIframeAPIReady = () => resolve();
	  });
	}

  function cleanup() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (resizeRaf) {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = null;
    }

    if (ytPlayer?.destroy) {
      ytPlayer.destroy();
    }
  }
  window.addEventListener('beforeunload', cleanup);

  async function initializeMusicPlayer() {
    try {
      // load persisted state first
      persistedState = loadState();
      loadFavorites();

      //PLAYLISTS_DATA = [
      //    { name: "Main Playlist", songs: SONGS_DATA },
      //    { name: "Alternative Mix #1", songs: PLAYLIST_TWO_DATA },
      //    { name: "Alternative Mix #2", songs: PLAYLIST_THREE_DATA }
      //];
      PLAYLISTS_DATA = (typeof campaignTrail_temp !== 'undefined' && campaignTrail_temp.compact_playlist)
        ? [
          { name: "Obamalings' Favorites", songs: ALT_PLAYLIST }
        ]
        : [
          { name: "Main Playlist", songs: SONGS_DATA },
          { name: "Alternative Mix #1", songs: PLAYLIST_TWO_DATA },
          { name: "Alternative Mix #2", songs: PLAYLIST_THREE_DATA }
        ];

      updateFavoritesPlaylistEntry();

      activePlaylistIndex = (persistedState && Number.isInteger(persistedState.activePlaylistIndex) && persistedState.activePlaylistIndex >= 0 && persistedState.activePlaylistIndex < PLAYLISTS_DATA.length)
        ? persistedState.activePlaylistIndex : 0;

      const selectedPlaylistData = PLAYLISTS_DATA[activePlaylistIndex];
      const initialSongs = selectedPlaylistData.songs.map(d => new Song(d.title, d.artist, d.coverLink, d.videoIds || d.videoId));
      originalSongOrderForCurrentPlaylist = [...initialSongs];

      // apply shuffle and song restore
      if (persistedState?.shuffle) {
        isShuffleActive = true;
        playlist = new Playlist(shuffleArray(initialSongs));
      } else {
        playlist = new Playlist(initialSongs);
      }
      if (persistedState?.currentVideoId) {
        const idx = playlist.getSongs().findIndex(s => s.containsVideoId(persistedState.currentVideoId));
        playlist.setCurrentSongIndex(idx >= 0 ? idx : 0);
      }

      const playerFragment = createPlayerElements();
      const anchorElement = document.getElementById("game_window");
      (anchorElement?.parentNode || document.body).insertBefore(playerFragment, anchorElement?.nextSibling || null);

      // render cover flow
	  createCoverFlowPool();
	  resetCoverFlow();
	  
      // preload covers
      preloadCovers(playlist.getSongs());

      // build dropdown
      if (playlistSelectorElement) {
        const optsFrag = document.createDocumentFragment();
        PLAYLISTS_DATA.forEach((pl, index) => {
          const option = document.createElement("option");
          option.value = index.toString();
          option.textContent = pl.name;
          optsFrag.appendChild(option);
        });
        playlistSelectorElement.appendChild(optsFrag);
        playlistSelectorElement.value = activePlaylistIndex.toString();
      }

      // restore other states
      if (persistedState?.repeatMode) repeatMode = persistedState.repeatMode;
      if (persistedState?.queueVisible) queueContainerElement.classList.remove('hidden');
      if (typeof persistedState?.volume === 'number') {
        volumeSlider.value = String(persistedState.volume);
		volumeSlider.style.setProperty('--volume-percent', `${Math.round(persistedState.volume * 100)}%`);
        if (volumePercentageElement) volumePercentageElement.textContent = `${Math.round(persistedState.volume * 100)}%`;
      }
      if (persistedState?.muted) applyMuteOnReady = true;

      injectPlayerStyles();
      bindUIEventListeners();
      updateUI();
      updateCoverFlow();
      updateFavoriteButtonUI();

      await loadYouTubeAPI();
	  
      ytPlayer = new YT.Player(YOUTUBE_PLAYER_DIV_ID, {
        height: '200', width: '200',
        playerVars: { 'playsinline': 1, 'autoplay': 0, 'controls': 0, 'disablekb': 1, 'modestbranding': 1, 'origin': window.location.origin, 'rel': 0, 'iv_load_policy': 3 },
        events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange, 'onError': onPlayerError }
      });
    } catch (error) {
      console.error("Failed during music player initialization:", error);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeMusicPlayer);
  else initializeMusicPlayer();

})();
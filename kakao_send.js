const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyODQ3NjNiNTVhYmEwNmZhODdhODVlNjc5YzY0YWRkMSIsIm5iZiI6MS43NDcyMTIyMDQ2MjMwMDAxZSs5LCJzdWIiOiI2ODI0NTdhYzgyOTZlYTM4ZWRhMTZjZDgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.b_kzVINHrsQZtJoVgIfLUHjrGBHiDNz7ZkecgNi4ZhI'
    }
};

fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err));

{
    "page"; 1,
        "results"; [
            {
                "adult": false,
                "backdrop_path": "/qdKGpTHVaaKaFTnRynQDg4qHdEv.jpg",
                "genre_ids": [
                    10751,
                    35,
                    12,
                    14
                ],
                "id": 950387,
                "original_language": "en",
                "original_title": "A Minecraft Movie",
                "overview": "Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination. To get back home, they'll have to master this world while embarking on a magical quest with an unexpected, expert crafter, Steve.",
                "popularity": 647.9372,
                "poster_path": "/yFHHfHcUgGAxziP1C3lLt0q2T4s.jpg",
                "release_date": "2025-03-31",
                "title": "A Minecraft Movie",
                "video": false,
                "vote_average": 6.392,
                "vote_count": 1051
            },
            {
                "adult": false,
                "backdrop_path": "/cJvUJEEQ86LSjl4gFLkYpdCJC96.jpg",
                "genre_ids": [
                    10752,
                    28
                ],
                "id": 1241436,
                "original_language": "en",
                "original_title": "Warfare",
                "overview": "A platoon of Navy SEALs embarks on a dangerous mission in Ramadi, Iraq, with the chaos and brotherhood of war retold through their memories of the event.",
                "popularity": 437.279,
                "poster_path": "/srj9rYrjefyWqkLc6l2xjTGeBGO.jpg",
                "release_date": "2025-04-09",
                "title": "Warfare",
                "video": false,
                "vote_average": 7.131,
                "vote_count": 294
            },
            {
                "adult": false,
                "backdrop_path": "/jRvhP4AfFnJ03lCQhp1fie7XPSd.jpg",
                "genre_ids": [
                    28,
                    53
                ],
                "id": 977294,
                "original_language": "en",
                "original_title": "Tin Soldier",
                "overview": "An ex-special forces operative seeks revenge against a cult leader who has corrupted his former comrades, the Shinjas. This leader, known as The Bokushi, promises veterans a purpose and protection, but is revealed to be a destructive influence. The ex-soldier, Nash Cavanaugh, joins forces with military operative Emmanuel Ashburn to infiltrate the Bokushi's fortress and expose his reign of terror",
                "popularity": 394.0376,
                "poster_path": "/lFFDrFLXywFhy6khHes1LCFVMsL.jpg",
                "release_date": "2025-05-22",
                "title": "Tin Soldier",
                "video": false,
                "vote_average": 5.75,
                "vote_count": 4
            },
            {
                "adult": false,
                "backdrop_path": "/4A5HH9HkCPqAwyYL6CnA0mxbYjn.jpg",
                "genre_ids": [
                    28,
                    80,
                    53
                ],
                "id": 1144430,
                "original_language": "fr",
                "original_title": "Balle perdue 3",
                "overview": "Car genius Lino returns to conclude his vendetta against Areski and the corrupt commander who ruined their lives in this turbo-charged trilogy finale.",
                "popularity": 323.405,
                "poster_path": "/qycPITRqXgPai7zj1gKffjCdSB5.jpg",
                "release_date": "2025-05-06",
                "title": "Last Bullet",
                "video": false,
                "vote_average": 6.82,
                "vote_count": 100
            },
            {
                "adult": false,
                "backdrop_path": "/tyfO9jHgkhypUFizRVYD0bytPjP.jpg",
                "genre_ids": [
                    10751,
                    14
                ],
                "id": 447273,
                "original_language": "en",
                "original_title": "Snow White",
                "overview": "Following the benevolent King's disappearance, the Evil Queen dominated the once fair land with a cruel streak. Princess Snow White flees the castle when the Queen, in her jealousy over Snow White's inner beauty, tries to kill her. Deep into the dark woods, she stumbles upon seven magical dwarves and a young bandit named Jonathan. Together, they strive to survive the Queen's relentless pursuit and aspire to take back the kingdom.",
                "popularity": 307.2328,
                "poster_path": "/xWWg47tTfparvjK0WJNX4xL8lW2.jpg",
                "release_date": "2025-03-12",
                "title": "Snow White",
                "video": false,
                "vote_average": 4.354,
                "vote_count": 748
            },
            {
                "adult": false,
                "backdrop_path": "/rthMuZfFv4fqEU4JVbgSW9wQ8rs.jpg",
                "genre_ids": [
                    28,
                    878,
                    12
                ],
                "id": 986056,
                "original_language": "en",
                "original_title": "Thunderbolts*",
                "overview": "After finding themselves ensnared in a death trap, seven disillusioned castoffs must embark on a dangerous mission that will force them to confront the darkest corners of their pasts.",
                "popularity": 279.2427,
                "poster_path": "/m9EtP1Yrzv6v7dMaC9mRaGhd1um.jpg",
                "release_date": "2025-04-30",
                "title": "Thunderbolts*",
                "video": false,
                "vote_average": 7.496,
                "vote_count": 833
            },
            {
                "adult": false,
                "backdrop_path": "/fTrQsdMS2MUw00RnzH0r3JWHhts.jpg",
                "genre_ids": [
                    28,
                    80,
                    53
                ],
                "id": 1197306,
                "original_language": "en",
                "original_title": "A Working Man",
                "overview": "Levon Cade left behind a decorated military career in the black ops to live a simple life working construction. But when his boss's daughter, who is like family to him, is taken by human traffickers, his search to bring her home uncovers a world of corruption far greater than he ever could have imagined.",
                "popularity": 268.735,
                "poster_path": "/6FRFIogh3zFnVWn7Z6zcYnIbRcX.jpg",
                "release_date": "2025-03-26",
                "title": "A Working Man",
                "video": false,
                "vote_average": 6.509,
                "vote_count": 659
            },
            {
                "adult": false,
                "backdrop_path": "/9yMmIou6xMtw2A61xiMsEcAhTrL.jpg",
                "genre_ids": [
                    28,
                    18,
                    35
                ],
                "id": 897160,
                "original_language": "ko",
                "original_title": "용감한 시민",
                "overview": "An expelled boxing champion, who now is a high-school teacher, witnesses intolerable violence and throws her first punch to build justice against it, while putting on a mask.",
                "popularity": 262.1413,
                "poster_path": "/6Ea5i6APeTfm4hHh6dg5Z733JVS.jpg",
                "release_date": "2023-10-25",
                "title": "Brave Citizen",
                "video": false,
                "vote_average": 7.1,
                "vote_count": 36
            },
            {
                "adult": false,
                "backdrop_path": "/mrmaTVp7PTBkjj5G62cE9pjrENg.jpg",
                "genre_ids": [
                    27,
                    18
                ],
                "id": 1359977,
                "original_language": "en",
                "original_title": "Conjuring the Cult",
                "overview": "After discovering his blood-soaked daughter dead in the bathtub, David Bryson attends a self-help group to help save him from his ghostly nightmares. But when a group of mysterious cult-like women offer to help him resurrect his daughter. David's choices will not just decide his fate... but the fate of his dead daughter's SOUL.",
                "popularity": 245.5953,
                "poster_path": "/t4MiAeYpjL7saYvqvcn9xtOfA4K.jpg",
                "release_date": "2024-10-01",
                "title": "Conjuring the Cult",
                "video": false,
                "vote_average": 4.357,
                "vote_count": 14
            },
            {
                "adult": false,
                "backdrop_path": "/bVm6udIB6iKsRqgMdQh6HywuEBj.jpg",
                "genre_ids": [
                    53,
                    28
                ],
                "id": 1233069,
                "original_language": "de",
                "original_title": "Exterritorial",
                "overview": "When her son vanishes inside a US consulate, ex-special forces soldier Sara does everything in her power to find him — and uncovers a dark conspiracy.",
                "popularity": 241.1955,
                "poster_path": "/jM2uqCZNKbiyStyzXOERpMqAbdx.jpg",
                "release_date": "2025-04-29",
                "title": "Exterritorial",
                "video": false,
                "vote_average": 6.563,
                "vote_count": 319
            },
            {
                "adult": false,
                "backdrop_path": "/j0NUh5irX7q2jIRtbLo8TZyRn6y.jpg",
                "genre_ids": [
                    27,
                    9648
                ],
                "id": 574475,
                "original_language": "en",
                "original_title": "Final Destination Bloodlines",
                "overview": "Plagued by a violent recurring nightmare, college student Stefanie heads home to track down the one person who might be able to break the cycle and save her family from the grisly demise that inevitably awaits them all.",
                "popularity": 194.1285,
                "poster_path": "/cAoktVUBhGyULRoxV6mZ2LB3x7I.jpg",
                "release_date": "2025-05-09",
                "title": "Final Destination Bloodlines",
                "video": false,
                "vote_average": 7.184,
                "vote_count": 79
            },
            {
                "adult": false,
                "backdrop_path": "/8eifdha9GQeZAkexgtD45546XKx.jpg",
                "genre_ids": [
                    28,
                    53,
                    878
                ],
                "id": 822119,
                "original_language": "en",
                "original_title": "Captain America: Brave New World",
                "overview": "After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident. He must discover the reason behind a nefarious global plot before the true mastermind has the entire world seeing red.",
                "popularity": 177.4418,
                "poster_path": "/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg",
                "release_date": "2025-02-12",
                "title": "Captain America: Brave New World",
                "video": false,
                "vote_average": 6.12,
                "vote_count": 1835
            },
            {
                "adult": false,
                "backdrop_path": "/zXUxcXnBPHF1cD0IHi4KUpsNvF4.jpg",
                "genre_ids": [
                    53,
                    18,
                    10749
                ],
                "id": 1323784,
                "original_language": "es",
                "original_title": "Mala influencia",
                "overview": "An ex-con gets a fresh start when hired to protect a wealthy heiress from a stalker — but their chemistry is hard to resist as they grow closer.",
                "popularity": 175.1156,
                "poster_path": "/ghhooCOqQDqC6vhS1SVN2tCE0k8.jpg",
                "release_date": "2025-01-24",
                "title": "Bad Influence",
                "video": false,
                "vote_average": 5.549,
                "vote_count": 92
            },
            {
                "adult": false,
                "backdrop_path": "/jI8j3vy1fFZpjaGA6ALuyQuadfm.jpg",
                "genre_ids": [
                    27
                ],
                "id": 1260820,
                "original_language": "es",
                "original_title": "Stream",
                "overview": "Craven, a streamer with thousands of followers on a live streaming platform, has prepared a very special stream for Halloween. What no one expects when reacting to a video of Pentagram, a group of young paranormal investigators, is that the live experience will turn into the worst night of their lives. And maybe... the last.",
                "popularity": 174.5044,
                "poster_path": "/nnyjtBfUYA8ASHA9OhADrX0sMNQ.jpg",
                "release_date": "2024-02-06",
                "title": "Stream",
                "video": false,
                "vote_average": 6.318,
                "vote_count": 11
            },
            {
                "adult": false,
                "backdrop_path": "/12tEzU0bNYKIjXXEwI5abuOotHF.jpg",
                "genre_ids": [
                    37
                ],
                "id": 710258,
                "original_language": "en",
                "original_title": "Rust",
                "overview": "Infamous outlaw Harland Rust breaks his estranged grandson Lucas out of prison, after Lucas is convicted to hang for an accidental murder. The two must outrun legendary U.S Marshal Wood Helm and bounty hunter Fenton \"Preacher\" Lang who are hot on their tails. Deeply buried secrets rise from the ashes and an unexpected familial bond begins to form as the mismatched duo tries to survive the merciless American Frontier.",
                "popularity": 163.0692,
                "poster_path": "/tbJ3RkA2s6X5qrBzrYHYTxvDBui.jpg",
                "release_date": "2025-05-01",
                "title": "Rust",
                "video": false,
                "vote_average": 6.489,
                "vote_count": 44
            },
            {
                "adult": false,
                "backdrop_path": "/bIh56F8e5EaZ3r2nD1hXAOisItZ.jpg",
                "genre_ids": [
                    12,
                    10751
                ],
                "id": 1094473,
                "original_language": "fr",
                "original_title": "Bambi, l'histoire d'une vie dans les bois",
                "overview": "The life of Bambi, a male roe deer, from his birth through childhood, the loss of his mother, the finding of a mate, the lessons he learns from his father, and the experience he gains about the dangers posed by human hunters in the forest.",
                "popularity": 162.7618,
                "poster_path": "/vWNVHtwOhcoOEUSrY1iHRGbgH8O.jpg",
                "release_date": "2024-10-16",
                "title": "Bambi: A Life in the Woods",
                "video": false,
                "vote_average": 6.167,
                "vote_count": 12
            },
            {
                "adult": false,
                "backdrop_path": "/op3qmNhvwEvyT7UFyPbIfQmKriB.jpg",
                "genre_ids": [
                    28,
                    14,
                    12
                ],
                "id": 324544,
                "original_language": "en",
                "original_t": null
            }
        ]
      }

import requests
import pymysql

db_user = "root"
db_port = 3306
db_host = ""
db_name = "wits"
db_password = ""

def fetch_songs(artist_name):
    """
    주어진 가수의 노래 정보를 가져와 배열에 저장하는 함수.
    :param artist_name: 검색할 가수의 이름.
    :return: 노래 정보가 담긴 배열.
    """
    url = f'https://itunes.apple.com/search?term={artist_name}&entity=song&attribute=allArtistTerm&meida=music&limit=30&country=KR'
    response = requests.get(url)
    data = response.json()
    return data['results']

def save_songs_and_themes(songs):
    """
    노래 정보와 장르(테마)를 데이터베이스에 저장하는 함수.
    :param songs: 저장할 노래 정보가 담긴 배열.
    """
    connection = pymysql.connect(host=db_host,
                                 user=db_user,
                                 password=db_password,
                                 db=db_name,
                                 port=db_port,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)

    try:
        with connection.cursor() as cursor:
            for song in songs:
                # 노래 정보 저장
                sql_song = "INSERT INTO `songs` (`name`, `preview_url`, `album_url`) VALUES (%s, %s, %s)"
                cursor.execute(sql_song, (song['trackName'], song['previewUrl'], song['artworkUrl100']))
                song_id = cursor.lastrowid

                # 장르(테마) 검색 및 저장
                genre_name = song['primaryGenreName']
                sql_search_genre = "SELECT `id` FROM `themes` WHERE `name` = %s"
                cursor.execute(sql_search_genre, (genre_name,))
                theme = cursor.fetchone()

                if not theme:
                    # 장르가 없으면 새로 추가
                    sql_insert_genre = "INSERT INTO `themes` (`name`) VALUES (%s)"
                    cursor.execute(sql_insert_genre, (genre_name,))
                    theme_id = cursor.lastrowid
                else:
                    theme_id = theme['id']

                # 노래와 장르 관계 저장
                sql_songs_to_themes = "INSERT INTO `songs_to_themes` (`song_id`, `theme_id`) VALUES (%s, %s)"
                cursor.execute(sql_songs_to_themes, (song_id, theme_id))

            connection.commit()

    finally:
        connection.close()

# 예시 사용
artist_names = [
    "아이유",
    "뉴진스",
    "트와이스",
    "방탄소년단",
    "에스파",
    "빅뱅",
    "아이브",
    "블랙핑크"
]

for artist_name in artist_names: 
    songs = fetch_songs(artist_name)
    res = []
    for song in songs:
        try:
            print(f'{song["primaryGenreName"]}, {song["trackName"]}, {song["artistName"]}') # {song["previewUrl"]}, {song["artworkUrl100"]}')
            print("")
            res.append(song)
        except:
            print("\nError\n")
            print(song)
            print("Error: " + song)
    save_songs_and_themes(res)

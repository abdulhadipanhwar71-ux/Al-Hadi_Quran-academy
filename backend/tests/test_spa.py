def test_spa_index_served(client):
    res = client.get("/")
    assert res.status_code == 200
    assert "logo.jpg" in res.text
    assert 'id="root"' in res.text

def test_spa_client_routes_fallback(client):
    # Direct deep routes must serve index.html for client-side routing
    for path in ["/about", "/courses", "/quran", "/contact", "/admission"]:
        res = client.get(path)
        assert res.status_code == 200
        assert 'id="root"' in res.text

def test_logo_served_with_correct_media_type(client):
    res = client.get("/logo.jpg")
    assert res.status_code == 200
    assert res.headers["content-type"] == "image/jpeg"
    assert len(res.content) > 10000 # Actual logo bytes

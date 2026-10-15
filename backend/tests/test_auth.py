def test_user_reg_and_login(client):

    # Registrierung testen
    reg_resp = client.post(
        "/users/",
        json={"name": "Pytest User", "email": "pytest@example.com","role": "user", "password": "password123"}
    )
    assert reg_resp.status_code == 200
    user_data = reg_resp.json()
    assert user_data["email"] == "pytest@example.com"
    assert "id" in user_data

    #Login testen
    login_resp = client.post(
        "/login",
        data={"username": "pytest@example.com", "password": "password123"}
    )
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    # Route mit Bearer aufrufen
    token = token_data["access_token"]
    me_response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "pytest@example.com"


def test_login_failed_with_wrong_password(client):
# Registrieren
    client.post(
        "/users/",
        json={"email": "pytest2@example.com", "password": "rightpassword"}
    )

    # Login mit falschem Passwort
    response = client.post(
        "/login",
        data={"username": "pytest2@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "E-Mail or Password is wrong"


def test_protected_route_without_token(client):
    # Keine Header übergeben
    response = client.get("/users/me")
    assert response.status_code == 401

    # Ungültiges Token übergeben
    bad_token_response = client.get(
        "/users/me",
        headers={"Authorization": "Bearer invalidtoken123"}
    )
    assert bad_token_response.status_code == 401

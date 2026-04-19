from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_generate_returns_joke():
    mock_response = MagicMock()
    mock_response.text = "Why did the chicken cross the road? To get to the other side!"

    with patch("app.main.model.generate_content", return_value=mock_response):
        response = client.post("/generate", json={"category": "Dad Jokes", "keywords": ""})

    assert response.status_code == 200
    assert response.json()["joke"] == "Why did the chicken cross the road? To get to the other side!"


def test_generate_returns_502_on_gemini_exception():
    with patch("app.main.model.generate_content", side_effect=Exception("API error")):
        response = client.post("/generate", json={"category": None, "keywords": "test"})

    assert response.status_code == 502


def test_generate_returns_502_on_empty_response():
    mock_response = MagicMock()
    mock_response.text = ""

    with patch("app.main.model.generate_content", return_value=mock_response):
        response = client.post("/generate", json={"category": None, "keywords": ""})

    assert response.status_code == 502


def test_generate_accepts_keywords_only():
    mock_response = MagicMock()
    mock_response.text = "Santa walks into a bar..."

    with patch("app.main.model.generate_content", return_value=mock_response):
        response = client.post("/generate", json={"category": None, "keywords": "santa"})

    assert response.status_code == 200
    assert "joke" in response.json()

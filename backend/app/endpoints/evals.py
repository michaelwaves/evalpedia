from fastapi import APIRouter
from inspect_evals.metadata import load_listing


router = APIRouter()


@router.get("/evals")
def get_evals():
    return load_listing()

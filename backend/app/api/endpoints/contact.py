from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import ContactMessage
from app.schemas.schemas import ContactMessageCreate, ContactMessageOut

router = APIRouter(prefix="/contact", tags=["Contact Inquiries"])

@router.post("", response_model=ContactMessageOut, status_code=status.HTTP_201_CREATED)
def submit_contact_message(
    payload: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    message = ContactMessage(
        name=payload.name.strip(),
        email=payload.email.strip(),
        phone=payload.phone.strip() if payload.phone else None,
        subject=payload.subject.strip(),
        message=payload.message.strip(),
        is_read=False
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

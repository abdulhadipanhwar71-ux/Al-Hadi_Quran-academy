from sqlalchemy.orm import Session
from ..models import AuditLog
import logging

logger = logging.getLogger("alhadi.audit")

def log_admin_action(
    db: Session,
    admin_id: int,
    action: str,
    entity_type: str,
    entity_id: int = None,
    details: str = None,
    ip_address: str = None
):
    try:
        log = AuditLog(
            admin_id=admin_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            details=details,
            ip_address=ip_address
        )
        db.add(log)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to record audit log: {e}")
        db.rollback()

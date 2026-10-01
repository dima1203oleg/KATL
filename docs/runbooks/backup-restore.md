# Backup and Disaster Recovery Runbook

**Service:** KATL / CATL BESS Ukraine Platform  
**Target RPO:** < 1 hour  
**Target RTO:** < 15 minutes  

---

## 1. Automated PostgreSQL Backup Procedure

1. **Daily Full Logical Dump**:
   ```bash
   pg_dump -h localhost -U katl_user -Fc -d katl_production -f /backups/katl_db_$(date +%Y%m%d_%H%M%S).dump
   ```

2. **Snapshot Retention Policy**:
   * Hourly backups kept for 48 hours.
   * Daily backups kept for 30 days.
   * Monthly snapshots archived to cold S3 object storage for 1 year.

---

## 2. Restore Acceptance Test Verification

1. **Provision Clean Target Database**:
   ```bash
   dropdb -h localhost -U katl_user katl_restore_test --if-exists
   createdb -h localhost -U katl_user katl_restore_test
   ```

2. **Execute Restore**:
   ```bash
   pg_restore -h localhost -U katl_user -d katl_restore_test -v /backups/latest.dump
   ```

3. **Verify Record Counts**:
   ```sql
   SELECT count(*) FROM pim_products;
   SELECT count(*) FROM rfq_records;
   SELECT count(*) FROM audit_logs;
   ```

-- DropForeignKey
ALTER TABLE "clientes" DROP CONSTRAINT "clientes_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_tenantId_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

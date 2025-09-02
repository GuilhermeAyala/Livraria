-- CreateTable
CREATE TABLE "public"."Funcionario" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "salario" DOUBLE PRECISION NOT NULL,
    "cargo" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Books" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);



SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."check_is_editor"() RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
  begin
    RETURN EXISTS( SELECT 1 FROM editors WHERE id = auth.uid() );
  end;
$$;


ALTER FUNCTION "public"."check_is_editor"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_product_ids_by_tags"("tag_ids" integer[]) RETURNS TABLE("product_id" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT PT.product_id
  FROM "PRODUCTS_TAGS" PT
  WHERE PT.tag_id = ANY(tag_ids)
  GROUP BY PT.product_id
  HAVING COUNT(DISTINCT PT.tag_id) = ARRAY_LENGTH(tag_ids, 1);
END;
$$;


ALTER FUNCTION "public"."get_product_ids_by_tags"("tag_ids" integer[]) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."PRODUCTS" (
    "id" bigint NOT NULL,
    "title" "text" DEFAULT ''::"text" NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL,
    "quantity" smallint DEFAULT '0'::smallint NOT NULL,
    "average_rating" real DEFAULT '0'::real NOT NULL,
    "discount" smallint DEFAULT '0'::smallint NOT NULL,
    "price" real DEFAULT '123.99'::real NOT NULL,
    "price_with_discount" numeric GENERATED ALWAYS AS (("price" - (("price" * ("discount")::double precision) / (100)::double precision))) STORED
);


ALTER TABLE "public"."PRODUCTS" OWNER TO "postgres";


COMMENT ON TABLE "public"."PRODUCTS" IS 'Store products in the warehouse';



CREATE OR REPLACE FUNCTION "public"."get_random_items"("amount" smallint, "exclude_id" bigint) RETURNS SETOF "public"."PRODUCTS"
    LANGUAGE "sql"
    AS $_$
  SELECT * FROM "PRODUCTS"
  WHERE id != $2
  ORDER BY RANDOM()
  LIMIT $1;
$_$;


ALTER FUNCTION "public"."get_random_items"("amount" smallint, "exclude_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reduce_product_quantity"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Update the products table, reducing the quantity based on the inserted item's quantity
  UPDATE "PRODUCTS"
  SET quantity = quantity - NEW.quantity
  WHERE id = NEW.product_id;

  -- Ensure the function completes successfully
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."reduce_product_quantity"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_product_average_rating"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE "PRODUCTS"
  SET average_rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM "REVIEWS" REV
    WHERE REV.product_id = COALESCE(NEW.product_id, OLD.product_id)
  )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_product_average_rating"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."AVATARS" (
    "id" "uuid" NOT NULL,
    "backgroundColor" character varying DEFAULT '9c6951'::character varying,
    "hairColor" character varying DEFAULT '605de4'::character varying,
    "skinColor" character varying DEFAULT 'c99c62'::character varying,
    "eyes" "text" DEFAULT 'normal'::"text",
    "hair" "text" DEFAULT 'bowlCutHair'::"text",
    "mouth" "text" DEFAULT 'openedSmile'::"text",
    "accessories" "text" DEFAULT 'glasses'::"text",
    "accessoriesProbability" smallint DEFAULT '0'::smallint
);


ALTER TABLE "public"."AVATARS" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."CARTS" (
    "id" bigint NOT NULL,
    "product_id" bigint NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "quantity" smallint NOT NULL
);


ALTER TABLE "public"."CARTS" OWNER TO "postgres";


ALTER TABLE "public"."CARTS" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."CARTS_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."ORDERS" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "payment_id" "text" DEFAULT ''::"text" NOT NULL,
    "total_amount" real NOT NULL,
    "id" bigint NOT NULL
);


ALTER TABLE "public"."ORDERS" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ORDERS_ITEMS" (
    "id" bigint NOT NULL,
    "order_id" bigint NOT NULL,
    "product_id" bigint,
    "quantity" smallint DEFAULT '0'::smallint NOT NULL,
    "subtotal" real NOT NULL,
    "title" "text" NOT NULL
);


ALTER TABLE "public"."ORDERS_ITEMS" OWNER TO "postgres";


COMMENT ON TABLE "public"."ORDERS_ITEMS" IS 'products and orders relation';



ALTER TABLE "public"."ORDERS_ITEMS" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ORDERS_ITEMS_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."ORDERS" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ORDERS_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."PRODUCTS_TAGS" (
    "id" bigint NOT NULL,
    "product_id" bigint,
    "tag_id" bigint
);


ALTER TABLE "public"."PRODUCTS_TAGS" OWNER TO "postgres";


COMMENT ON TABLE "public"."PRODUCTS_TAGS" IS 'Junction table for PRODUCTS & TAGS';



ALTER TABLE "public"."PRODUCTS" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."PRODUCTS_product_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."PRODUCTS_TAGS" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."PRODUCTTAGS_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."PROFILES" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "display_name" "text" DEFAULT 'New user'::"text" NOT NULL
);


ALTER TABLE "public"."PROFILES" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."REVIEWS" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "product_id" bigint NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "feedback" "text" DEFAULT ''::"text" NOT NULL,
    "rating" smallint DEFAULT '0'::smallint NOT NULL,
    "id" bigint NOT NULL
);


ALTER TABLE "public"."REVIEWS" OWNER TO "postgres";


COMMENT ON TABLE "public"."REVIEWS" IS 'product reviews';



ALTER TABLE "public"."REVIEWS" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."REVIEWS_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."TAGS" (
    "id" bigint NOT NULL,
    "name" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."TAGS" OWNER TO "postgres";


ALTER TABLE "public"."TAGS" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."TAGS_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."WISHLIST" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" bigint NOT NULL
);


ALTER TABLE "public"."WISHLIST" OWNER TO "postgres";


ALTER TABLE "public"."WISHLIST" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."WISHLIST_ITEMS_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."editors" (
    "id" "uuid" NOT NULL
);


ALTER TABLE "public"."editors" OWNER TO "postgres";


COMMENT ON TABLE "public"."editors" IS 'users that are editors';



ALTER TABLE ONLY "public"."AVATARS"
    ADD CONSTRAINT "AVATARS_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."CARTS"
    ADD CONSTRAINT "CARTS_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ORDERS_ITEMS"
    ADD CONSTRAINT "ORDERS_ITEMS_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ORDERS"
    ADD CONSTRAINT "ORDERS_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."ORDERS"
    ADD CONSTRAINT "ORDERS_payment_id_key" UNIQUE ("payment_id");



ALTER TABLE ONLY "public"."ORDERS"
    ADD CONSTRAINT "ORDERS_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."PRODUCTS"
    ADD CONSTRAINT "PRODUCTS_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."PRODUCTS"
    ADD CONSTRAINT "PRODUCTS_product_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."PRODUCTS_TAGS"
    ADD CONSTRAINT "PRODUCTTAGS_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."PROFILES"
    ADD CONSTRAINT "PROFILES_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."REVIEWS"
    ADD CONSTRAINT "REVIEWS_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."REVIEWS"
    ADD CONSTRAINT "REVIEWS_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."TAGS"
    ADD CONSTRAINT "TAGS_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."TAGS"
    ADD CONSTRAINT "TAGS_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."WISHLIST"
    ADD CONSTRAINT "WISHLIST_ITEMS_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."editors"
    ADD CONSTRAINT "editors_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "reduce_quantity_on_insert" AFTER INSERT ON "public"."ORDERS_ITEMS" FOR EACH ROW EXECUTE FUNCTION "public"."reduce_product_quantity"();



CREATE OR REPLACE TRIGGER "update_average_rating" AFTER INSERT OR DELETE OR UPDATE ON "public"."REVIEWS" FOR EACH ROW EXECUTE FUNCTION "public"."update_product_average_rating"();



ALTER TABLE ONLY "public"."AVATARS"
    ADD CONSTRAINT "AVATARS_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."PROFILES"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."CARTS"
    ADD CONSTRAINT "CARTS_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."PRODUCTS"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."CARTS"
    ADD CONSTRAINT "CARTS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."PROFILES"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ORDERS_ITEMS"
    ADD CONSTRAINT "ORDERS_ITEMS_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."ORDERS"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ORDERS_ITEMS"
    ADD CONSTRAINT "ORDERS_ITEMS_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."PRODUCTS"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ORDERS"
    ADD CONSTRAINT "ORDERS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."PRODUCTS_TAGS"
    ADD CONSTRAINT "PRODUCTS_TAGS_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."PRODUCTS"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."PRODUCTS_TAGS"
    ADD CONSTRAINT "PRODUCTTAGS_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."TAGS"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."PROFILES"
    ADD CONSTRAINT "PROFILES_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."REVIEWS"
    ADD CONSTRAINT "REVIEWS_author_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."PROFILES"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."REVIEWS"
    ADD CONSTRAINT "REVIEWS_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."PRODUCTS"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."WISHLIST"
    ADD CONSTRAINT "WISHLIST_ITEMS_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."PRODUCTS"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."WISHLIST"
    ADD CONSTRAINT "WISHLIST_ITEMS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."editors"
    ADD CONSTRAINT "editors_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE "public"."AVATARS" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."CARTS" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable all actions for editors" ON "public"."PRODUCTS" TO "authenticated" USING ("public"."check_is_editor"()) WITH CHECK ("public"."check_is_editor"());



CREATE POLICY "Enable all actions for editors" ON "public"."PRODUCTS_TAGS" TO "authenticated" USING ("public"."check_is_editor"()) WITH CHECK ("public"."check_is_editor"());



CREATE POLICY "Enable all actions for editors" ON "public"."TAGS" TO "authenticated" USING ("public"."check_is_editor"()) WITH CHECK ("public"."check_is_editor"());



CREATE POLICY "Enable all actions to user's own row" ON "public"."REVIEWS" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable insert for a user's own row" ON "public"."AVATARS" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."PROFILES" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for user based on user_id" ON "public"."ORDERS_ITEMS" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."ORDERS" "o"
  WHERE (("o"."id" = "ORDERS_ITEMS"."order_id") AND ("o"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Enable insert for users based on user_id" ON "public"."ORDERS" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable read access for all users" ON "public"."AVATARS" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."PRODUCTS" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."PRODUCTS_TAGS" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."PROFILES" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."REVIEWS" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."TAGS" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."editors" FOR SELECT USING (true);



CREATE POLICY "Enable select for user based on user_id" ON "public"."ORDERS_ITEMS" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."ORDERS" "o"
  WHERE (("o"."id" = "ORDERS_ITEMS"."order_id") AND ("o"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Enable select for users based on user_id" ON "public"."ORDERS" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable update action to one's own avatar" ON "public"."AVATARS" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Enable update action to one's own profile" ON "public"."PROFILES" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



ALTER TABLE "public"."ORDERS" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ORDERS_ITEMS" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."PRODUCTS" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."PRODUCTS_TAGS" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."PROFILES" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."REVIEWS" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."TAGS" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can modify their own rows only" ON "public"."WISHLIST" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can only modify their own cart items" ON "public"."CARTS" TO "authenticated" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."WISHLIST" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."editors" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
































































































































































































GRANT ALL ON FUNCTION "public"."check_is_editor"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_is_editor"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_is_editor"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_product_ids_by_tags"("tag_ids" integer[]) TO "anon";
GRANT ALL ON FUNCTION "public"."get_product_ids_by_tags"("tag_ids" integer[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_product_ids_by_tags"("tag_ids" integer[]) TO "service_role";



GRANT ALL ON TABLE "public"."PRODUCTS" TO "anon";
GRANT ALL ON TABLE "public"."PRODUCTS" TO "authenticated";
GRANT ALL ON TABLE "public"."PRODUCTS" TO "service_role";
GRANT ALL ON TABLE "public"."PRODUCTS" TO "editor";



GRANT ALL ON FUNCTION "public"."get_random_items"("amount" smallint, "exclude_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_random_items"("amount" smallint, "exclude_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_random_items"("amount" smallint, "exclude_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."reduce_product_quantity"() TO "anon";
GRANT ALL ON FUNCTION "public"."reduce_product_quantity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reduce_product_quantity"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_product_average_rating"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_product_average_rating"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_product_average_rating"() TO "service_role";





















GRANT ALL ON TABLE "public"."AVATARS" TO "anon";
GRANT ALL ON TABLE "public"."AVATARS" TO "authenticated";
GRANT ALL ON TABLE "public"."AVATARS" TO "service_role";



GRANT ALL ON TABLE "public"."CARTS" TO "anon";
GRANT ALL ON TABLE "public"."CARTS" TO "authenticated";
GRANT ALL ON TABLE "public"."CARTS" TO "service_role";



GRANT ALL ON SEQUENCE "public"."CARTS_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."CARTS_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."CARTS_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."ORDERS" TO "anon";
GRANT ALL ON TABLE "public"."ORDERS" TO "authenticated";
GRANT ALL ON TABLE "public"."ORDERS" TO "service_role";



GRANT ALL ON TABLE "public"."ORDERS_ITEMS" TO "anon";
GRANT ALL ON TABLE "public"."ORDERS_ITEMS" TO "authenticated";
GRANT ALL ON TABLE "public"."ORDERS_ITEMS" TO "service_role";



GRANT ALL ON SEQUENCE "public"."ORDERS_ITEMS_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ORDERS_ITEMS_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ORDERS_ITEMS_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."ORDERS_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ORDERS_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ORDERS_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."PRODUCTS_TAGS" TO "anon";
GRANT ALL ON TABLE "public"."PRODUCTS_TAGS" TO "authenticated";
GRANT ALL ON TABLE "public"."PRODUCTS_TAGS" TO "service_role";



GRANT ALL ON SEQUENCE "public"."PRODUCTS_product_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."PRODUCTS_product_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."PRODUCTS_product_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."PRODUCTTAGS_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."PRODUCTTAGS_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."PRODUCTTAGS_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."PROFILES" TO "anon";
GRANT ALL ON TABLE "public"."PROFILES" TO "authenticated";
GRANT ALL ON TABLE "public"."PROFILES" TO "service_role";



GRANT ALL ON TABLE "public"."REVIEWS" TO "anon";
GRANT ALL ON TABLE "public"."REVIEWS" TO "authenticated";
GRANT ALL ON TABLE "public"."REVIEWS" TO "service_role";



GRANT ALL ON SEQUENCE "public"."REVIEWS_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."REVIEWS_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."REVIEWS_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."TAGS" TO "anon";
GRANT ALL ON TABLE "public"."TAGS" TO "authenticated";
GRANT ALL ON TABLE "public"."TAGS" TO "service_role";



GRANT ALL ON SEQUENCE "public"."TAGS_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."TAGS_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."TAGS_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."WISHLIST" TO "anon";
GRANT ALL ON TABLE "public"."WISHLIST" TO "authenticated";
GRANT ALL ON TABLE "public"."WISHLIST" TO "service_role";



GRANT ALL ON SEQUENCE "public"."WISHLIST_ITEMS_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."WISHLIST_ITEMS_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."WISHLIST_ITEMS_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."editors" TO "anon";
GRANT ALL ON TABLE "public"."editors" TO "authenticated";
GRANT ALL ON TABLE "public"."editors" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
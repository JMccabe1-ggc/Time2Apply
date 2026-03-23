from config.client import supabase


def load_skill_aliases():

    res = supabase.table("skill_aliases").select("alias").execute()
    # aliases = []
    # for row in res.data:
    #     aliases.append(row['alias'].lower())
    return [row["alias"].lower() for row in res.data]
    # ex: return ["py", "ml"]


def load_alias_to_skill_map():

    res = (
        supabase.table("skill_aliases")
        .select("alias, skills(skill_name)")
        .execute()
    )

    alias_map = {}

    for row in res.data:
        alias = row["alias"].lower()
        canonical = row["skills"]["skill_name"]

        alias_map[alias] = canonical

    return alias_map
    # ex: return {"py": "python", "ml": "machine learning"}
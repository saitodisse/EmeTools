using System.Web.Script.Serialization;

namespace JsonHelper
{
    public static class JsonSerializer
    {
        public static string Serialize(object objeto)
        {
            var serializer = new JavaScriptSerializer();
            return serializer.Serialize(objeto);
        }

        public static T Deserialize<T>(string jsonText)
        {
            var deserializer = new JavaScriptSerializer();
            return deserializer.Deserialize<T>(jsonText);
        }
    }
}